import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/Alert';
import useAlert from '../../hooks/useAlert';

const SignupPage = () => {
  // Destructure initialLoading from useAuth, alongside other properties
  const { fetchLoading, fetchError: authError, register, user, initialLoading } = useAuth();
  const navigate = useNavigate();
  const { alertMessage, alertType, showAlert, clearAlert } = useAlert();

  const [formData, setFormData] = useState({ username: '', email: '', password: '', age: '' });
  // New local state to manage loading specifically for the signup form submission
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  // Redirect if user is already authenticated and not currently checking session
  useEffect(() => {
    // Only redirect if a user exists AND we are not in the middle of the initial session check
    if (user && !initialLoading) {
      navigate('/home', { replace: true });
    }
  }, [user, initialLoading, navigate]); // Added initialLoading to dependencies

  // Show auth errors from context, but only if they are not related to initialLoading
  useEffect(() => {
    // Show error if authError exists and we are not in initial loading,
    // OR if the error specifically occurred DURING the initial loading
    if (authError && !fetchLoading && !initialLoading) {
      showAlert(authError.message || 'An authentication error occurred.', 'error');
    }
  }, [authError, fetchLoading, showAlert, initialLoading]); // Added initialLoading to dependencies

  const handleChange = (e) => {
    if (alertType === 'error') {
      clearAlert();
    }
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showAlert('Username is required.', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      showAlert('Email is required.', 'error');
      return false;
    }
    if (!formData.password.trim()) {
      showAlert('Password is required.', 'error');
      return false;
    }
    // Basic email validation
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

    setIsSignupSubmitting(true); // Start signup specific loading
    try {
      const result = await register(formData.username.trim(), formData.email.trim(), formData.password, formData.age.trim());

      if (result && result.success !== false) {
        showAlert('Signup successful! Redirecting...', 'success');
        setFormData({ username: '', email: '', password: '', age: '' }); // Clear all form data
        // The navigate will be handled by the useEffect watching 'user' and 'initialLoading'
      } else {
        showAlert(result?.message || 'Signup failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error("Signup failed:", err);
      // authError from useAuth/useFetch will already be set and trigger the useEffect
      let errorMessage = 'Signup failed. Please try again.';
      showAlert(errorMessage, 'error');
    } finally {
      setIsSignupSubmitting(false); // End signup specific loading
    }
  };

  // Disable submit button if it's currently submitting (local state),
  // if inputs are empty, or if initial session check is ongoing
  const isSubmitDisabled = isSignupSubmitting || !formData.username.trim() || !formData.email.trim() || !formData.password.trim() || initialLoading;

  // --- Adaptive Tailwind CSS Classes (remain unchanged) ---
  const containerClasses = `
    min-h-screen flex items-center justify-center p-4
    bg-gray-100
    dark:bg-zinc-900
    transition-colors duration-300
  `;

  const formContainerClasses = `
    w-full max-w-sm space-y-4 p-6
    bg-white text-gray-900
    dark:bg-zinc-800 dark:text-white
    rounded-lg shadow-xl
  `;

  const inputClasses = `
    p-3 rounded w-full
    bg-gray-200 text-gray-900 border border-gray-300 placeholder-gray-500
    dark:bg-zinc-700 dark:text-white dark:border-zinc-600 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
    transition-colors duration-300
  `;

  const buttonClasses = `
    w-full bg-red-600 hover:bg-red-700 text-white
    py-3 rounded font-semibold text-lg
    transition duration-300 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    dark:focus:ring-offset-zinc-800
  `;

  // Render a loading state if initial session check is ongoing
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
          Sign Up
        </h2>

        {alertMessage && (
          <Alert message={alertMessage} type={alertType} onClose={clearAlert} />
        )}

        <div>
          <label htmlFor="username" className="sr-only">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            autoComplete="username"
            className={inputClasses}
            disabled={isSignupSubmitting} // Disable input if submitting
          />
        </div>
        <div>
          <label htmlFor="age" className="sr-only">Age</label>
          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age (optional)"
            autoComplete="off" // Age might not have a standard autoComplete
            className={inputClasses}
            disabled={isSignupSubmitting} // Disable input if submitting
          />
        </div>
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
            disabled={isSignupSubmitting} // Disable input if submitting
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
            autoComplete="new-password"
            className={inputClasses}
            disabled={isSignupSubmitting} // Disable input if submitting
          />
        </div>

        <button
          type="submit"
          className={buttonClasses}
          disabled={isSubmitDisabled}
          aria-label={isSignupSubmitting ? 'Signing up...' : 'Sign up for an account'}
        >
          {isSignupSubmitting ? ( // Use local state for button text
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing up...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
