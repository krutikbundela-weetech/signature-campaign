import { useState, useEffect } from "react";

const AuthModal = ({ onAuthenticate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeesData, setEmployeesData] = useState(null);

  // Function to determine user type
  const getUserType = (email) => {
    if (!employeesData) return "employee";

    // Check if user is HR
    const isHR = employeesData.hrBoard?.hr?.some(
      (hr) => hr.email.toLowerCase() === email.toLowerCase()
    );

    // Check if user is Board member
    const isBoard = employeesData.hrBoard?.board?.some(
      (board) => board.email.toLowerCase() === email.toLowerCase()
    );

    if (isHR) return "hr";
    if (isBoard) return "board";
    return "employee";
  };

  useEffect(() => {
    // Check if user is already authenticated
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    const storedUserType = localStorage.getItem("userType");

    if (storedEmail && storedName) {
      onAuthenticate({
        name: storedName,
        email: storedEmail,
        userType: storedUserType || "employee",
      });
      setIsOpen(false);
    }

    // Fetch employees data
    fetch("/employees.json")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.employees);
        setEmployeesData(data);
      })
      .catch((err) => console.error("Error loading employees:", err));
  }, [onAuthenticate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if email exists in any category (employees, HR, or board)
    const isEmployee = employees.some(
      (emp) =>
        emp.email.toLowerCase() === email.toLowerCase() &&
        emp.name.toLowerCase() === name.toLowerCase()
    );

    const isHROrBoard =
      employeesData &&
      (employeesData.hrBoard?.hr?.some(
        (hr) => hr.email.toLowerCase() === email.toLowerCase()
      ) ||
        employeesData.hrBoard?.board?.some(
          (board) => board.email.toLowerCase() === email.toLowerCase()
        ));

    if (!isEmployee && !isHROrBoard) {
      setError("Name or Email not found in our records");
      return;
    }

    // Determine user type
    const userType = getUserType(email);

    // Store in localStorage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    localStorage.setItem("userType", userType);

    // Notify parent component
    onAuthenticate({ name, email, userType });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-neutral-dark/80 via-brand/20 to-extra-midnight/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-scale-in border border-neutral-border/20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-neutral-dark bg-gradient-to-r from-brand to-extra-turquoise bg-clip-text text-transparent">
            WeeTechies Trip Signature Campaign
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-accent-yellow to-accent-coral mx-auto mt-2 rounded-full"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-accent-coral/10 to-accent-coral/5 text-accent-coral rounded-xl border border-accent-coral/20 animate-shake">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="transform transition-all duration-300 hover:scale-105">
            <label
              htmlFor="name"
              className="block text-neutral-dark font-semibold</label> mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-300 bg-neutral-light/30"
              placeholder="johnsmith"
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-105">
            <label
              htmlFor="email"
              className="block text-neutral-dark font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all duration-300 bg-neutral-light/30"
              placeholder="johnsmith@weetechsolution.com"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-brand/5 via-extra-turquoise/10 to-brand/5 border border-brand/20">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-brand mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-dark">
                  Required Format
                </h3>
                <div className="text-sm text-neutral-dark/80 space-y-1">
                  <p>Please use your company email address:</p>
                  <p className="font-mono bg-white/50 p-2 rounded-lg border border-brand/10">
                    johnsmith@weetechsolution.com
                  </p>
                  <p>Your username should match the email prefix:</p>
                  <p className="font-mono bg-white/50 p-2 rounded-lg border border-brand/10">
                    johnsmith
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand to-extra-turquoise hover:from-brand-dark hover:to-extra-seagreen text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand/30"
          >
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
