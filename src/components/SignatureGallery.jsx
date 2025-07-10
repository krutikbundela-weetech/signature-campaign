import { useState, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../utils/api';

const SignatureGallery = ({ signatures, employees, currentUserEmail }) => {
  const [allEmployeesSigned, setAllEmployeesSigned] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  useEffect(() => {
    console.log('SignatureGallery - Received signatures:', signatures);
    console.log('SignatureGallery - Received employees:', employees);
    console.log('SignatureGallery - Current user email:', currentUserEmail);
    
    // Ensure signatures and employees are arrays
    const signaturesArray = Array.isArray(signatures) ? signatures : [];
    const employeesArray = Array.isArray(employees) ? employees : [];
    
    // Check if all employees have signed
    if (signaturesArray.length > 0 && employeesArray.length > 0) {
      // Filter out any signatures with missing email
      const validSignatures = signaturesArray.filter(sig => sig && sig.email);
      const signedEmails = validSignatures.map(sig => sig.email.toLowerCase());
      console.log('SignatureGallery - Valid signatures:', validSignatures);
      console.log('SignatureGallery - Signed emails:', signedEmails);
      
      const allSigned = employeesArray.every(emp => 
        emp && emp.email && signedEmails.includes(emp.email.toLowerCase())
      );
      
      console.log('SignatureGallery - All employees signed:', allSigned);
      setAllEmployeesSigned(allSigned);
      
      // Show send button only for specific user
      if (allSigned && currentUserEmail === 'krutik@weetechsolution.com') {
        console.log('SignatureGallery - Showing send button for admin user');
        setShowSendButton(true);
      }
    }
  }, [signatures, employees, currentUserEmail]);
  
  const sendToHR = async () => {
    setIsSending(true);
    
    try {
      console.log('Preparing to send signatures to HR:', signatures);
      
      // Ensure we have valid signatures to send
      const validSignatures = Array.isArray(signatures) ? 
        signatures.filter(sig => sig && sig.email && sig.signature) : [];
      
      if (validSignatures.length === 0) {
        console.error('No valid signatures to send');
        alert('No valid signatures to send. Please ensure signatures are available.');
        setIsSending(false);
        return;
      }
      
      console.log('Valid signatures to send:', validSignatures.length);
      const payload = { signatures: validSignatures };
      console.log('Sending payload:', payload);
      
      // Call the server endpoint to send email
      console.log('Sending request to send email API');
      const response = await apiCall(API_ENDPOINTS.sendEmail, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      console.log('Response received, status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        console.log('Email sent successfully:', result);
        setSendSuccess(true);
        alert('Email sent successfully to HR & Board Directors!');
      } else {
        console.error('Failed to send email:', result.error);
        alert(`Failed to send email: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Error sending email: ${error.message}. Please check your connection and try again.`);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent-lavender to-accent-yellow rounded-full mb-4 animate-pulse-gentle">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-4xl font-bold text-neutral-dark bg-gradient-to-r from-accent-lavender to-accent-yellow bg-clip-text text-transparent mb-2">
          Signature Gallery
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-accent-lavender to-accent-yellow mx-auto rounded-full"></div>
      </div>
      
      {allEmployeesSigned && (
        <div className="mb-8 p-6 bg-gradient-to-r from-extra-seagreen/10 via-brand/10 to-extra-turquoise/10 border-2 border-extra-seagreen/30 rounded-2xl text-center animate-bounce-subtle">
          <div className="flex items-center justify-center mb-2">
            <span className="text-4xl mr-2 animate-spin-slow">🎉</span>
            <p className="text-2xl font-bold text-extra-seagreen">All employees have signed the petition!</p>
            <span className="text-4xl ml-2 animate-spin-slow">🎉</span>
          </div>
          <div className="w-full h-2 bg-gradient-to-r from-extra-seagreen via-brand to-extra-turquoise rounded-full mt-4 animate-pulse"></div>
        </div>
      )}
      
      {showSendButton && (
        <div className="mb-8 flex justify-center">
          {!sendSuccess ? (
            <button
              onClick={sendToHR}
              disabled={isSending}
              className={`bg-gradient-to-r from-brand to-extra-turquoise hover:from-brand-dark hover:to-extra-seagreen text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand/30 ${isSending ? 'opacity-50 cursor-not-allowed animate-pulse' : 'animate-pulse-gentle'}`}
            >
              <span className="flex items-center">
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send to HR & Board Directors
                  </>
                )}
              </span>
            </button>
          ) : (
            <div className="p-6 bg-gradient-to-r from-extra-seagreen/10 to-brand/10 border-2 border-extra-seagreen/30 rounded-2xl text-center w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-extra-seagreen mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-bold text-extra-seagreen text-lg">Email sent successfully!</p>
              </div>
              <p className="text-neutral-dark">HR and Board Directors have been notified.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(signatures) && signatures.filter(sig => sig && sig.signature).map((sig, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-neutral-border/20 transform animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6 bg-gradient-to-r from-neutral-light to-white border-b border-neutral-border/20">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-brand to-extra-turquoise rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {(sig.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-dark">{sig.name || 'Unknown'}</h3>
                  <p className="text-neutral-dark/60 text-sm">{sig.email || 'No email provided'}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-neutral-dark/50">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sig.timestamp ? new Date(sig.timestamp).toLocaleDateString() : 'Date unknown'}
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-neutral-light/30 to-white">
              <div className="bg-white rounded-xl p-4 border-2 border-neutral-border/20 shadow-inner">
                <img 
                  src={sig.signature} 
                  alt={`${sig.name || 'Unknown'}'s signature`} 
                  className="w-full h-32 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(!Array.isArray(signatures) || signatures.length === 0 || !signatures.some(sig => sig && sig.signature)) && (
        <div className="text-center p-12 bg-gradient-to-br from-neutral-light/50 to-white rounded-2xl border-2 border-dashed border-neutral-border animate-pulse-gentle">
          <div className="w-20 h-20 bg-gradient-to-r from-accent-lavender to-accent-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <p className="text-xl text-neutral-dark font-semibold mb-2">No signatures yet</p>
          <p className="text-neutral-dark/60">Be the first to sign and start the campaign!</p>
        </div>
      )}
    </div>
  );
};

export default SignatureGallery;