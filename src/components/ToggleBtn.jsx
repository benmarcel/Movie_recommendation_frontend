
// This hook handles loading state and errors, making it reusable across the application.
import useTheme from '../hooks/useTheme'; // a custom hook for theme management
const ToggleBtn = () => {
  const { theme, toggleTheme } = useTheme();
      const buttonClasses = `p-2 rounded-full w-10 h-10 flex items-center justify-center text-xl cursor-pointer ${
    theme === 'dark' ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400'
  } transition-colors duration-300`;
  return (
     <button onClick={toggleTheme} className={buttonClasses}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
  )
}

export default ToggleBtn