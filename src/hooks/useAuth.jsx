import { AuthContext } from "../contexts/authContext";
import { useContext } from "react";

const useAuth = () => {
  const context = useContext(AuthContext);
  // Check if the context is undefined, which means useAuth is not used within AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;
// This custom hook provides access to the authentication context.
// It simplifies the process of accessing authentication methods and user state in components.