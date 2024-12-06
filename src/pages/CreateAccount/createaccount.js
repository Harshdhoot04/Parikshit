import React, { useState } from "react";
import { signUp } from "../config/firebase"; // Import Firebase signup function
import { useNavigate } from "react-router-dom";
import thImage from "../assets/th.jpeg"; // Import your image

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // State for user type
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) {
      setError("Please select a user type.");
      return;
    }
    try {
      // Sign up the user using Firebase Auth
      await signUp(email, password);
      navigate("/registration"); // Navigate to Registration page after account creation
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-box">
      {/* Image at the top of the form */}
      <img src={thImage} alt="Create Account" className="form-image" />
      <h2>Create Account</h2>
      {error && <p className="error-message">{error}</p>}

      {/* User Type Section */}
      <div className="user-type-container">
        <h4>Select User Type</h4>
        <div className="user-type">
          <label>
            <input
              type="radio"
              value="Student"
              checked={userType === "Student"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              value="Instructor"
              checked={userType === "Instructor"}
              onChange={(e) => setUserType(e.target.value)}
            />
            Instructor
          </label>
        </div>
      </div>

      {/* Input fields for account creation */}
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Sign up and proceed buttons */}
      <button onClick={handleSubmit}>Sign Up</button>
      <button className="proceed-button" onClick={() => navigate("/registration")}>
        Proceed
      </button>

      {/* Link to Login page */}
      <div className="link-container">
        <span className="link-text" onClick={() => navigate("/login")}>
          Already have an account? Log In
        </span>
      </div>
    </div>
  );
};

export default CreateAccount;
