import { useState, useEffect } from "react";
import SignatureGallery from "./SignatureGallery";

const HRBoardView = ({ user, signatures, employees }) => {
  const [funnyMessages] = useState([
    "Employees have started practicing their beach cricket skills in the hallway. It's getting dangerous. 🏐",
    "Rumor has it, the coffee machine is planning a strike unless the team gets a vacation. ☕🚨",
    "Your hardworking team has officially declared a 'spreadsheet emergency' and urgently needs vitamin D therapy! 🌞",
    "The team has unanimously voted that their productivity would increase by 200% after a company trip (results may vary, but enthusiasm guaranteed)! 📈",
    "Team spirit is high, but so is the stack of Bugs. Only a trip can flatten it! 📚✈️",
    "The team promises to bring back sand, seashells, and fresh ideas. 🐚",
    "Spreadsheet cells can't contain our wanderlust anymore! 🧳",
    "We've run out of motivational posters. Time for real inspiration! 🖼️",
    "If laughter is the best medicine, a trip is the ultimate prescription. 😂✈️",
    "Your staff has been spotted googling 'how to escape office life legally' - we think a company trip might be the answer! 🏃‍♂️",
  ]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [signatureCount, setSignatureCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    // Count signatures and employees
    setSignatureCount(Array.isArray(signatures) ? signatures.length : 0);
    setEmployeeCount(Array.isArray(employees) ? employees.length : 0);
  }, [signatures, employees]);

  useEffect(() => {
    let currentIndex = 0;

    const rotateMessage = () => {
      setIsMessageVisible(false); // Trigger fade out

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % funnyMessages.length;
        setCurrentMessage(funnyMessages[currentIndex]);
        setIsMessageVisible(true); // Trigger fade in
      }, 300); // Wait for fade out to complete
    };

    // Set initial message
    setCurrentMessage(funnyMessages[0]);
    setIsMessageVisible(true);

    // Start the interval
    const intervalId = setInterval(rotateMessage, 5000); // Total time for each message (including fade)

    return () => clearInterval(intervalId);
  }, [funnyMessages]);

  const getProgressPercentage = () => {
    if (employeeCount === 0) return 0;
    return Math.round((signatureCount / employeeCount) * 100);
  };

  const getUserTypeDisplay = () => {
    if (user.userType === "hr") return "HR Manager";
    if (user.userType === "board") return "Board Director";
    return "Manager";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-accent-yellow/10 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12 text-center transform animate-slide-down">
          <div className="inline-block p-8 bg-gradient-to-r from-accent-lavender to-accent-yellow rounded-3xl shadow-2xl mb-6 animate-pulse-gentle">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="w-16 h-16 text-white mr-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                />
              </svg>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  Team Trip Request
                </h1>
                <p className="text-xl text-white/90 mt-2">
                  Dashboard for{" "}
                  {getUserTypeDisplay().charAt(0).toUpperCase() +
                    getUserTypeDisplay().slice(1)}
                </p>
              </div>
            </div>
            <div className="w-32 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-neutral-border animate-bounce-subtle">
            <p className="text-2xl text-neutral-dark font-semibold">
              Welcome, {user.name.charAt(0).toUpperCase() + user.name.slice(1)}!
              👋
            </p>
            <p className="text-lg text-neutral-dark/70 mt-2">
              Your team has something important to tell you...
            </p>
          </div>
        </header>

        {/* Main Message Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-neutral-border/20 transform animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-brand to-extra-turquoise rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-gentle">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-neutral-dark bg-gradient-to-r from-brand to-extra-turquoise bg-clip-text text-transparent mb-4">
              🏝️ Official Team Trip Petition 🏝️
            </h2>
          </div>

          <div className="bg-gradient-to-r from-accent-yellow/10 to-accent-coral/10 rounded-2xl p-8 mb-8 border-l-4 border-accent-yellow">
            <p className="text-xl text-neutral-dark leading-relaxed mb-6">
              Dear Esteemed {getUserTypeDisplay()},
            </p>

            <p
              className={`text-lg text-neutral-dark leading-relaxed mb-6 transition-opacity duration-500 ease-in-out ${
                isMessageVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentMessage}
            </p>

            <div className="bg-white rounded-xl p-6 shadow-inner mb-6">
              <h3 className="text-xl font-bold text-neutral-dark mb-4 flex items-center">
                <span className="w-6 h-6 bg-extra-seagreen rounded-full mr-3 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Why Your Team Deserves This Trip:
              </h3>
              <ul className="space-y-3 text-neutral-dark">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-coral rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    They've been working harder than a coffee machine on Monday
                    morning ☕
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-coral rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Team bonding activities will boost collaboration (and create
                    hilarious memories) 🤝
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-coral rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    A change of scenery will spark creativity and innovation 💡
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-coral rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    Happy WeeTechies = productive WeeTechies = successful
                    WeeTech 📈
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-accent-coral rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>
                    They promise to come back with better tans and even better
                    ideas 🌞
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-lg text-neutral-dark leading-relaxed mb-6">
              We promise this isn't just an elaborate scheme to avoid
              spreadsheets and Bugs (okay, maybe it's 10% that, but 90% genuine
              team building)! Your employees have put their hearts, souls, and
              digital signatures into this request.
            </p>

            <p className="text-lg text-neutral-dark leading-relaxed mb-6">
              Think of it as an investment in happiness, productivity, and the
              prevention of office cabin fever! Plus, imagine the amazing team
              photos and success stories you'll have to share! 📸
            </p>

            <p className="text-xl text-neutral-dark font-semibold">
              Yours hopefully (and with fingers crossed),
              <br />
              <span className="bg-gradient-to-r from-brand to-extra-turquoise bg-clip-text text-transparent">
                The WeeTechies ✨
              </span>
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-neutral-border/20 transform animate-slide-up">
          <h3 className="text-2xl font-bold text-neutral-dark mb-6 text-center">
            📊 Petition Progress
          </h3>

          <div className="bg-gradient-to-r from-neutral-light to-white rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-neutral-dark">
                Signatures Collected
              </span>
              <span className="text-2xl font-bold text-brand">
                {signatureCount} / {employeeCount}
              </span>
            </div>

            <div className="w-full bg-neutral-border rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-brand to-extra-turquoise h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-extra-seagreen">
                {getProgressPercentage()}%
              </span>
              <span className="text-neutral-dark ml-2">Complete</span>
            </div>
          </div>

          {getProgressPercentage() === 100 && (
            <div className="bg-gradient-to-r from-extra-seagreen/10 to-brand/10 border-2 border-extra-seagreen/30 rounded-2xl p-6 text-center animate-bounce-subtle">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-3 animate-spin-slow">🎉</span>
                <h4 className="text-2xl font-bold text-extra-seagreen">
                  100% Participation Achieved!
                </h4>
                <span className="text-4xl ml-3 animate-spin-slow">🎉</span>
              </div>
              <p className="text-lg text-neutral-dark">
                Every single WeeTechie has signed the petition! The enthusiasm
                is through the roof! 🚀
              </p>
            </div>
          )}
        </div>

        {/* Signature Gallery Section */}
        <div className="mb-8 transform animate-slide-up animation-delay-200">
          <SignatureGallery
            signatures={signatures}
            employees={employees}
            currentUserEmail={user.email}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="inline-block p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-neutral-border shadow-sm">
            <p className="text-neutral-dark/70">
              © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME} -
              <span className="text-brand font-semibold">
                {" "}
                Making Dreams Come True, One Signature at a Time
              </span>{" "}
              ✨
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HRBoardView;
