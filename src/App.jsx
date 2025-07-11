import { useState, useEffect } from "react";
import "./App.css";
import AuthModal from "./components/AuthModal";
import SignatureCanvas from "./components/SignatureCanvas";
import SignatureGallery from "./components/SignatureGallery";
import HRBoardView from "./components/HRBoardView";
import { apiCall, API_ENDPOINTS } from "./utils/api";
import config from "./config/env";

function App() {
  const [user, setUser] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Load employees data
    fetch("/employees.json")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.employees);
      })
      .catch((err) => {
        console.error("Error loading employees:", err);
      });

    // Load signatures from server
    loadSignaturesFromServer();
  }, []);

  // Function to load signatures from server
  const loadSignaturesFromServer = async () => {
    try {
      console.log("Fetching signatures from server...");
      const response = await apiCall(API_ENDPOINTS.signatures);
      if (response.ok) {
        const serverSignatures = await response.json();
        console.log("Signatures loaded from server:", serverSignatures);

        if (Array.isArray(serverSignatures)) {
          setSignatures(serverSignatures);
        } else {
          console.log("No signatures found on server or invalid format");
          setSignatures([]);
        }
      } else {
        console.error(
          "Failed to load signatures from server, status:",
          response.status
        );
        setSignatures([]);
      }
    } catch (error) {
      console.error("Error loading signatures from server:", error);
      setSignatures([]);
    }
  };

  const handleAuthentication = (userData) => {
    setUser(userData);
  };

  const handleSignatureSave = async (signatureData) => {
    console.log("Saving signature for:", signatureData.name);

    try {
      // Save signature to server
      const response = await apiCall(API_ENDPOINTS.saveSignature, {
        method: "POST",
        body: JSON.stringify(signatureData),
      });

      if (response.ok) {
        console.log("Signature saved to server successfully");
        // Reload signatures from server to get the updated list
        await loadSignaturesFromServer();
      } else {
        console.error(
          "Failed to save signature to server, status:",
          response.status
        );
        alert("Failed to save signature. Please try again.");
      }
    } catch (error) {
      console.error("Error saving signature to server:", error);
      alert(
        "Error saving signature. Please check your connection and try again."
      );
    }
  };

  // Generate a funny greeting message
  const generateGreeting = (name) => {
    const greetings = [
      `Hey ${name}, ready to escape spreadsheets and attend the chill-pills trip?`,
      `${name}! Sign here to trade your desk chair for a beach chair!`,
      `${name}, your signature is the key to unlocking fun outside these walls!`,
      `Attention ${name}! Your presence is requested on a mission to have actual fun!`,
      `${name}, sign now and we promise no team-building exercises... just pure fun!`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Function to clear all signatures from server
  const clearAllSignatures = async () => {
    try {
      const response = await apiCall(API_ENDPOINTS.clearSignatures, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("All signatures cleared from server");
        setSignatures([]);
        alert("All signatures have been cleared successfully.");
      } else {
        console.error("Failed to clear signatures from server");
        alert("Failed to clear signatures. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing signatures:", error);
      alert(
        "Error clearing signatures. Please check your connection and try again."
      );
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    
    // Reset user state
    setUser(null);
  };

  // Check if user is HR or Board member
  const isHROrBoard =
    user && (user.userType === "hr" || user.userType === "board");

  return (
    <>
      {!user && <AuthModal onAuthenticate={handleAuthentication} />}

      {user && isHROrBoard && (
        <HRBoardView
          user={user}
          signatures={signatures}
          employees={employees}
        />
      )}

      {user && !isHROrBoard && (
        <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-accent-yellow/10 py-8 px-4 animate-fade-in">
          <div className="container mx-auto">
            <header className="mb-8 text-center transform animate-slide-down">
              {/* Logout button - positioned above the main header content */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-accent-coral to-accent-coral/80 hover:from-accent-coral/90 hover:to-accent-coral text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 z-10"
                  title="Logout"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>

              <div className="inline-block p-6 bg-gradient-to-r from-brand to-extra-turquoise rounded-2xl shadow-lg mb-4 animate-pulse-gentle">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {config.appName}
                </h1>
                <div className="w-24 h-1 bg-accent-yellow mx-auto rounded-full"></div>
              </div>
              <p className="text-xl text-neutral-dark bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-neutral-border animate-bounce-subtle">
                {generateGreeting(user.name)}
              </p>
            </header>

            <main className="space-y-12">
              <div className="transform animate-slide-up">
                <SignatureCanvas
                  user={user}
                  onSignatureSave={handleSignatureSave}
                />
              </div>

              {/* Progress Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-neutral-border/20 transform animate-slide-up animation-delay-100">
                <h3 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
                  📊 Campaign Progress
                </h3>

                <div className="bg-gradient-to-r from-neutral-light to-white rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-neutral-dark">
                      Signatures Collected
                    </span>
                    <span className="text-2xl font-bold text-brand">
                      {signatures.length} / {employees.length}
                    </span>
                  </div>

                  <div className="w-full bg-neutral-border rounded-full h-4 mb-4">
                    <div
                      className="bg-gradient-to-r from-brand to-extra-turquoise h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${
                          employees.length > 0
                            ? Math.round(
                                (signatures.length / employees.length) * 100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="text-center">
                    <span className="text-3xl font-bold text-extra-seagreen">
                      {employees.length > 0
                        ? Math.round(
                            (signatures.length / employees.length) * 100
                          )
                        : 0}
                      %
                    </span>
                    <span className="text-neutral-dark ml-2">Complete</span>
                  </div>
                </div>

                {employees.length > 0 &&
                  signatures.length === employees.length && (
                    <div className="bg-gradient-to-r from-extra-seagreen/10 to-brand/10 border-2 border-extra-seagreen/30 rounded-2xl p-6 text-center animate-bounce-subtle">
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-4xl mr-3 animate-spin-slow">
                          🎉
                        </span>
                        <h4 className="text-2xl font-bold text-extra-seagreen">
                          100% Participation Achieved!
                        </h4>
                        <span className="text-4xl ml-3 animate-spin-slow">
                          🎉
                        </span>
                      </div>
                      <p className="text-lg text-neutral-dark">
                        Every single team member has signed the petition! The
                        enthusiasm is through the roof! 🚀
                      </p>
                    </div>
                  )}
              </div>

              <div className="transform animate-slide-up animation-delay-200">
                <SignatureGallery
                  signatures={signatures}
                  employees={employees}
                  currentUserEmail={user.email}
                />
              </div>

              {/* Debug controls - only visible for admin */}
              {user.email === config.adminEmail && (
                <div className="mt-8 p-6 bg-gradient-to-r from-accent-coral/10 to-accent-coral/5 border border-accent-coral/20 rounded-xl shadow-lg transform animate-slide-up animation-delay-400">
                  <h3 className="text-lg font-bold mb-4 text-accent-coral flex items-center">
                    <span className="w-3 h-3 bg-accent-coral rounded-full mr-2 animate-pulse"></span>
                    Admin Controls
                  </h3>
                  <button
                    onClick={clearAllSignatures}
                    className="bg-gradient-to-r from-accent-coral to-accent-coral/80 hover:from-accent-coral/90 hover:to-accent-coral text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Clear All Signatures
                  </button>
                </div>
              )}
            </main>

            <footer className="mt-16 text-center transform animate-fade-in animation-delay-600">
              <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-neutral-border shadow-sm">
                <p className="text-neutral-dark/70">
                  © {new Date().getFullYear()} {config.appName}
                </p>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

export default App;