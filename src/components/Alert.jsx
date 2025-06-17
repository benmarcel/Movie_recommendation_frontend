// src/components/Alert.jsx
import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // Controls visibility for transitions

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Automatically hide after `duration`
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Call onClose after the fade-out transition, if provided
        // You might need a small delay here if you have CSS transitions for opacity
        setTimeout(() => {
          if (onClose) onClose();
        }, 300); // Assuming 300ms for opacity transition
      }, duration);

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or message changes
    } else {
      setIsVisible(false); // Hide if message is cleared
    }
  }, [message, duration, onClose]);

  // Determine classes based on type
  let alertClasses = "fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded shadow-lg text-sm transition-all duration-300 ease-out z-50 transform";

  if (type === 'success') {
    alertClasses += " bg-green-700 text-white";
  } else if (type === 'error') {
    alertClasses += " bg-red-700 text-white";
  } else {
    // Default or info style
    alertClasses += " bg-blue-700 text-white";
  }

  // Add visibility classes for fade-in/out
  alertClasses += isVisible ? " opacity-100 translate-y-0" : " opacity-0 -translate-y-full pointer-events-none";

  if (!message) return null; // Don't render if no message

  return (
    <div className={alertClasses}>
      <div className="flex items-center justify-between">
        <p className="mr-4">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            // Small delay to allow fade-out before calling onClose
            setTimeout(() => {
              if (onClose) onClose();
            }, 300);
          }}
          className="ml-2 text-white hover:text-gray-200"
          aria-label="Close alert"
        >
          &times; {/* HTML entity for multiplication sign, often used as a close icon */}
        </button>
      </div>
    </div>
  );
};

export default Alert;