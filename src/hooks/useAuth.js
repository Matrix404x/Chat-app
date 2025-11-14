import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to access AuthContext values
export const useAuth = () => {
  return useContext(AuthContext);
};
