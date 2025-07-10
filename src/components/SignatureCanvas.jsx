import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignatureCanvas = ({ user, onSignatureSave }) => {
  const sigCanvas = useRef({});
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  
  const clear = () => {
    sigCanvas.current.clear();
    setIsSigning(false);
  };
  
  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      setError('Please provide your signature before saving');
      return;
    }
    
    setError('');
    const signatureData = sigCanvas.current.toDataURL('image/png');
    
    // Create signature object
    const signature = {
      name: user.name,
      email: user.email,
      signature: signatureData,
      timestamp: new Date().toISOString()
    };
    
    onSignatureSave(signature);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8 border border-neutral-border/20 transform transition-all duration-300 hover:shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-brand to-extra-turquoise rounded-full mb-4 animate-pulse-gentle">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-neutral-dark bg-gradient-to-r from-brand to-extra-turquoise bg-clip-text text-transparent">
          Your Signature
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-accent-yellow to-accent-coral mx-auto mt-2 rounded-full"></div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-accent-coral/10 to-accent-coral/5 text-accent-coral rounded-xl border border-accent-coral/20 animate-shake">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div 
        className={`border-3 rounded-xl mb-6 touch-none transition-all duration-300 ${
          isSigning 
            ? 'border-brand shadow-lg shadow-brand/20 bg-gradient-to-br from-neutral-light to-white' 
            : 'border-neutral-border hover:border-brand/50 bg-gradient-to-br from-neutral-light/50 to-white'
        }`}
        onTouchStart={() => setIsSigning(true)}
        onMouseDown={() => setIsSigning(true)}
      >
        <SignaturePad
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-64 rounded-xl',
            style: { touchAction: 'none' }
          }}
          backgroundColor="transparent"
        />
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={clear}
          className="flex-1 bg-gradient-to-r from-neutral-border to-neutral-border/80 hover:from-neutral-dark/20 hover:to-neutral-dark/10 text-neutral-dark font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-neutral-border"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </span>
        </button>
        
        <button
          onClick={save}
          className="flex-1 bg-gradient-to-r from-extra-seagreen to-brand hover:from-extra-seagreen/90 hover:to-brand/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-brand/30"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save My Signature
          </span>
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;