// hooks/useAlert.js
import { useState, useCallback } from 'react';


const useAlert = () => {
  // State for alert message and its type (e.g., 'error', 'success')
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('error'); // Default type for errors

  /**
   * `showAlert` is a memoized function to display an alert message.
   * message - The text content of the alert.
   * type - The type of alert (e.g., 'success', 'error', 'info', 'warning').
   */
  const showAlert = useCallback((message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    // Optionally, you could set a timeout here to auto-clear the alert
    // setTimeout(() => setAlertMessage(null), 5000);
  }, []); // No dependencies, so it's stable across renders

  /**
   * `clearAlert` is a memoized function to hide the current alert.
   */
  const clearAlert = useCallback(() => {
    setAlertMessage(null);
  }, []); // No dependencies, so it's stable across renders

  return {
    alertMessage,
    alertType,
    showAlert,
    clearAlert,
  };
};

export default useAlert;
