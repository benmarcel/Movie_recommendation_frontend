import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.jsx';
import Alert from '../../components/Alert.jsx';
import useAlert from '../../hooks/useAlert.jsx';

const LoginPage = () => {
  // Destructure initialLoading from useAuth
  const { login, fetchLoading, user, fetchError, initialLoading } = useAuth();
  const navigate = useNavigate();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Use a local state for when the login form is actively submitting
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);


  // Redirect if user is authenticated and not currently checking session
  useEffect(() => {
    // Only redirect if a user exists AND we are not in the middle of the initial session check
    // (This prevents a flash of the login page if the user is already logged in)
    if (user && !initialLoading) {
      navigate('/home', { replace: true });
    }
  }, [user, initialLoading, navigate]); // Added initialLoading to dependencies


  // Show auth errors from context, but only if they are not related to initialLoading
  useEffect(() => {
    // Show error if fetchError exists and we are not in initial loading,
    // OR if the error specifically occurred DURING the initial loading
    if (fetchError && !fetchLoading && !initialLoading) { // Changed condition
        showAlert(fetchError.message || 'Authentication error occurred', 'error');
    }
    // Note: If fetchError happens during initialLoading, the component should ideally handle a "failed to load session" message
    // but the current setup directly maps it to `alertMessage`.
  }, [fetchError, fetchLoading, showAlert, initialLoading]); // Added initialLoading to dependencies

  const handleChange = (e) => {
    if (alertType === 'error') {
      clearAlert();
    }
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      showAlert('Email is required.', 'error');
      return false;
    }

    if (!formData.password.trim()) {
      showAlert('Password is required.', 'error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('Please enter a valid email address.', 'error');
      return false;
    }

    if (formData.password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAlert();

    if (!validateForm()) {
      return;
    }

    setIsLoginSubmitting(true); // Start login specific loading
    try {
      const result = await login(formData.email.trim(), formData.password);

      if (result && result.success !== false) {
        showAlert('Login successful! Redirecting...', 'success');
        setFormData({ email: '', password: '' });
        // The navigate will be handled by the useEffect watching 'user' and 'initialLoading'
      } else {
        showAlert(result?.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (err) {
      console.error("Login failed:", err);
      // fetchError from useAuth/useFetch will already be set and trigger the useEffect
      let errorMessage = 'Login failed. Please try again.';
      showAlert(errorMessage, 'error');
    } finally {
      setIsLoginSubmitting(false); // End login specific loading
    }
  };

  // Disable submit button if it's currently submitting or if inputs are empty, or if initial session check is ongoing
  const isSubmitDisabled = isLoginSubmitting || !formData.email.trim() || !formData.password.trim() 

  // CSS classes for styling (unchanged)
  const containerClasses = `
    min-h-screen flex items-center justify-center p-4
    bg-gray-100 text-gray-900
    dark:bg-zinc-900 dark:text-white
    transition-colors duration-300
  `;

  const formContainerClasses = `
    w-full max-w-sm space-y-4 p-6
    bg-white
    dark:bg-zinc-800
    rounded-lg shadow-xl
  `;

  const inputClasses = `
    p-3 rounded w-full
    bg-gray-200 text-gray-900 border border-gray-300
    dark:bg-zinc-700 dark:text-white dark:border-zinc-600
    focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
    transition-colors duration-300
    placeholder-gray-500 dark:placeholder-zinc-400
  `;

  const buttonClasses = `
    w-full bg-red-600 hover:bg-red-700 text-white
    py-3 rounded font-semibold text-lg
    transition duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    dark:focus:ring-offset-zinc-800
  `;

  // // Render a loading state if initial session check is ongoing
  if (initialLoading) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-xl">
          <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit} className={formContainerClasses} noValidate>
        <h2 className="text-3xl font-bold text-center text-red-600 dark:text-red-500 mb-6">
          Sign In
        </h2>

        {alertMessage && (
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
        )}

        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            autoComplete="email"
            className={inputClasses}
            disabled={isLoginSubmitting} // Disable input if submitting
          />
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            autoComplete="current-password"
            className={inputClasses}
            disabled={isLoginSubmitting} // Disable input if submitting
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={buttonClasses}
          aria-label={isLoginSubmitting ? 'Logging in...' : 'Login to your account'}
        >
          {isLoginSubmitting ? ( // Use local state for button text
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
