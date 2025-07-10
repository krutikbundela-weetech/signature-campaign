require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

const path = require("path");

// Serve static frontend if in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));

  // Handle client-side routing fallback (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}


const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable or use defaults
    const corsOrigins =
      process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173";
    const allowedOriginStrings = corsOrigins
      .split(",")
      .map((url) => url.trim());

    // Create regex patterns for localhost and IP ranges (for development)
    const allowedOrigins = [
      ...allowedOriginStrings.map(
        (url) => new RegExp(`^${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)
      ),
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
    ];

    const isAllowed = allowedOrigins.some((pattern) => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// 1. Configure CORS
app.use(cors(corsOptions));

// 2. Handle preflight requests
app.options("*", cors(corsOptions));

// Middleware for parsing JSON
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure SavedSignatures directory exists
const savedSignaturesDir = path.join(
  __dirname,
  process.env.SIGNATURES_DIR || "public/SavedSignatures"
);
console.log("SavedSignatures directory path:", savedSignaturesDir);
if (!fs.existsSync(savedSignaturesDir)) {
  console.log("Creating SavedSignatures directory");
  fs.mkdirSync(savedSignaturesDir, { recursive: true });
} else {
  console.log("SavedSignatures directory already exists");
}

// API endpoint to save signature
app.post("/api/save-signature", (req, res) => {
  try {
    const signatureData = req.body;

    if (!signatureData || !signatureData.email || !signatureData.signature) {
      return res.status(400).json({ error: "Invalid signature data" });
    }

    // Create a safe filename from the email
    const safeEmail = signatureData.email.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${safeEmail}.json`;
    const filePath = path.join(savedSignaturesDir, filename);

    // Save the signature data to a file
    fs.writeFileSync(filePath, JSON.stringify(signatureData, null, 2));

    console.log(`Signature saved to ${filePath}`);
    res
      .status(200)
      .json({ success: true, message: "Signature saved successfully" });
  } catch (error) {
    console.error("Error saving signature:", error);
    res.status(500).json({ error: "Failed to save signature" });
  }
});

// API endpoint to get all signatures
app.get("/api/signatures", (req, res) => {
  try {
    const signatures = [];

    // Read all files in the SavedSignatures directory
    const files = fs.readdirSync(savedSignaturesDir);

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(savedSignaturesDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        try {
          const signatureData = JSON.parse(fileContent);
          signatures.push(signatureData);
        } catch (error) {
          console.error(`Error parsing ${file}:`, error);
        }
      }
    });

    res.status(200).json(signatures);
  } catch (error) {
    console.error("Error getting signatures:", error);
    res.status(500).json({ error: "Failed to get signatures" });
  }
});

// API endpoint to clear all signatures
app.delete("/api/clear-signatures", (req, res) => {
  try {
    // Read all files in the SavedSignatures directory
    const files = fs.readdirSync(savedSignaturesDir);

    // Delete all JSON files
    files.forEach((file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(savedSignaturesDir, file);
        fs.unlinkSync(filePath);
        console.log(`Deleted signature file: ${file}`);
      }
    });

    console.log("All signatures cleared successfully");
    res
      .status(200)
      .json({ success: true, message: "All signatures cleared successfully" });
  } catch (error) {
    console.error("Error clearing signatures:", error);
    res.status(500).json({ error: "Failed to clear signatures" });
  }
});

// Create a Nodemailer transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "tasks410@gmail.com",
    pass: process.env.EMAIL_PASS || "pvwj jlqx wpda vaoa",
  },
  tls: {
    rejectUnauthorized: process.env.TLS_REJECT_UNAUTHORIZED !== "false",
  },
});

// Function to load HR and Board emails from employees.json
const loadHRAndBoardEmails = () => {
  try {
    const employeesFilePath = path.join(
      __dirname,
      process.env.EMPLOYEES_FILE || "public/employees.json"
    );
    const employeesData = JSON.parse(
      fs.readFileSync(employeesFilePath, "utf8")
    );

    // Extract HR emails
    const hrEmails =
      employeesData.hrBoard?.hr
        ?.map((hr) => hr.email)
        .filter((email) => email) || [];

    // Extract Board emails
    const boardEmails =
      employeesData.hrBoard?.board
        ?.map((board) => board.email)
        .filter((email) => email) || [];

    // Remove duplicates by converting to Set and back to Array
    const uniqueHREmails = [...new Set(hrEmails)];
    const uniqueBoardEmails = [...new Set(boardEmails)];

    console.log("Loaded HR emails:", uniqueHREmails);
    console.log("Loaded Board emails:", uniqueBoardEmails);

    return {
      hrEmails: uniqueHREmails,
      boardEmails: uniqueBoardEmails,
    };
  } catch (error) {
    console.error(
      "Error loading HR and Board emails from employees.json:",
      error
    );
    // Fallback to default emails if file reading fails
    return {
      hrEmails: [process.env.ADMIN_EMAIL || "krutik@weetechsolution.com"],
      boardEmails: [],
    };
  }
};

// API endpoint to send email to HR and Board Directors
app.post("/api/send-email", async (req, res) => {
  console.log(
    "==== Received request to send email to HR and Board Directors ===="
  );
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);

  try {
    // Validate request body
    if (!req.body) {
      console.error("Request body is empty or undefined");
      return res
        .status(400)
        .json({ error: "Invalid request. Request body is required." });
    }

    if (!req.body.signatures) {
      console.error("Signatures not found in request body:", req.body);
      return res
        .status(400)
        .json({ error: "Invalid request. Signatures data is required." });
    }

    const signaturesCount = Array.isArray(req.body.signatures)
      ? req.body.signatures.length
      : 0;
    console.log(`Preparing to send email with ${signaturesCount} signatures`);

    if (signaturesCount === 0) {
      console.error("No valid signatures to send");
      return res.status(400).json({ error: "No valid signatures to send." });
    }

    // Load HR and Board emails from employees.json
    const { hrEmails, boardEmails } = loadHRAndBoardEmails();

    // Validate that we have at least one HR email
    if (hrEmails.length === 0) {
      console.error("No HR emails found in employees.json");
      return res
        .status(500)
        .json({
          error: "No HR emails configured. Please check employees.json file.",
        });
    }

    // Log some signature details for debugging
    if (Array.isArray(req.body.signatures) && req.body.signatures.length > 0) {
      console.log("First signature email:", req.body.signatures[0].email);
    }

    // Create a list of employee names who signed
    const employeeNames = req.body.signatures
      .map((sig) => sig.name || sig.email)
      .join(", ");

    // Create a funny email message
    const emailSubject =
      "🏝️ URGENT: Team Trip Request - Signed by Everyone! 🏝️";

    // Get frontend URL from environment
    const frontendUrl =
      process.env.VITE_FRONTEND_URL || "http://localhost:5173";

    // Create HTML content for the email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6ee0; text-align: center;">🏖️ Team Trip Request 🏖️</h2>
        
        <p style="font-size: 16px;">Dear HR and Board Directors,</p>
        
        <p style="font-size: 16px;">Hope this email finds you in high spirits and not buried under a mountain of paperwork! 😄</p>
        
        <p style="font-size: 16px;">We, the hardworking employees of our amazing company, have unanimously decided that we <strong>desperately</strong> need a company trip! Our productivity meters are off the charts, and we believe a little sun, sand, and team bonding would take us to even greater heights!</p>
        
        <p style="font-size: 16px;">We've collected signatures from <strong>${signaturesCount} employees</strong> who are all eagerly awaiting your approval:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="font-style: italic;">${employeeNames}</p>
        </div>
        
        <p style="font-size: 16px;">You can view all the signatures on our campaign website: <a href="${frontendUrl}/" style="color: #4a6ee0;">Signature Campaign</a></p>
        
        <p style="font-size: 16px;">We promise to come back more motivated, more creative, and with slightly better tans! 🌞</p>
        
        <p style="font-size: 16px;">Looking forward to your enthusiastic "YES!"</p>
        
        <p style="font-size: 16px;">Yours hopefully,<br>The Dream Team</p>
        
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
          <p>This email was automatically generated from our ${
            process.env.APP_NAME || "signature campaign"
          } application.</p>
        </div>
      </div>
    `;

    // Configure email options with dynamic recipients
    const mailOptions = {
      from: `"${process.env.APP_NAME || "Signature Campaign"}" <${
        process.env.EMAIL_USER || "tasks410@gmail.com"
      }>`,
      to: hrEmails.join(", "), // HR emails from employees.json
      cc: boardEmails.join(", "), // Board directors' emails from employees.json
      subject: emailSubject,
      html: emailHtml,
    };

    console.log("Sending email with the following options:", {
      to: mailOptions.to,
      cc: mailOptions.cc,
      subject: mailOptions.subject,
    });

    // Send the email
    try {
      console.log("Attempting to send email via Nodemailer...");

      // Send the actual email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);

      res.status(200).json({
        success: true,
        message: `Email sent successfully to ${hrEmails.length} HR recipient(s) and ${boardEmails.length} board member(s)`,
        recipients: {
          hr: hrEmails,
          board: boardEmails,
        },
      });
    } catch (emailError) {
      console.error("Error sending email via Nodemailer:", emailError);
      res
        .status(500)
        .json({ error: `Failed to send email: ${emailError.message}` });
    }
  } catch (error) {
    console.error("Error in email endpoint:", error);
    res.status(500).json({ error: "Failed to send email: " + error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `Frontend URL: ${process.env.VITE_FRONTEND_URL || "http://localhost:5173"}`
  );
});
