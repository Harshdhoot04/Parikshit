import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUserRole } from "../config/firebase";  // Adjust the path based on your project structure
import thImage from "../assets/th.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Check user role in localStorage and navigate accordingly
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "instructor") {
      navigate("/instructor-page");
    } else if (role === "student") {
      navigate("/courses");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error
    setLoading(true); // Show loading state
  
    localStorage.removeItem("role");
  
    if (!email || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }
  
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful, user:", user);
  
      // Fetch user role after login
      const role = await fetchUserRole(user.uid);
      console.log("Fetched user role:", role);
  
      // Set role in localStorage for persistence
      localStorage.setItem("role", role);
  
      // Redirect based on user role
      if (role === "instructor") {
        navigate("/instructor-page"); // Redirect to instructor page
      } else if (role === "student") {
        navigate("/courses"); // Redirect to courses page
      } else {
        setError("Your role isn't defined in the system. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  

  return (
    <div className="form-box">
        {/* Add the image at the top */}
        <div className="image-container">
        <img src={thImage} alt="Platform Logo" className="login-image" />
      </div>
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="link-container">
        <span className="link-text" onClick={() => navigate("/createaccount")}>
          New to the platform? Create Account 
        </span>
      </div>

      {/* Logout Button */}
    </div>
  );
};

export default Login;
