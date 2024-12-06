import React, { useState } from "react";
import { saveRegistrationData } from "../config/firebase";  // Only import once
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import thImage from "../assets/th.jpeg";

const Registration = () => {
  const [userType, setUserType] = useState(""); // User type (Student/Instructor)
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [location, setLocation] = useState("");
  const [branch, setBranch] = useState(""); // Student-specific
  const [yearOfStudy, setYearOfStudy] = useState(""); // Student-specific
  const [department, setDepartment] = useState(""); // Instructor-specific
  const [subjects, setSubjects] = useState(""); // Instructor-specific
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic Validation for both common and userType-specific fields
    if (!userType || !fullName || !dob || !collegeCode || !location) {
      setError("Please fill in all required fields.");
      return;
    }

    // Additional validation for userType-specific fields
    if (userType === "Student" && (!branch || !yearOfStudy)) {
      setError("Please fill in all student-specific fields.");
      return;
    }

    if (userType === "Instructor" && (!department || !subjects)) {
      setError("Please fill in all instructor-specific fields.");
      return;
    }

    // Prepare the registration data
    const registrationData = {
      fullName,
      userType,
      ...(userType === "Student" && { location, branch, yearOfStudy }),
      ...(userType === "Instructor" && { location, department, subjects }),
    };

    // Get current user from Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("No user is logged in. Please log in first.");
      return;
    }

    try {
      // Save registration data to Firebase, passing the userId and userType
      await saveRegistrationData(user.uid, registrationData, userType);

      // Navigate to the login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");  // More user-friendly error message
    }
  };

  return (
    <div className="form-box">
      <img src={thImage} alt="Register" className="form-image" />
      <h1>Registration</h1>
      {error && <p className="error-message">{error}</p>}

      {/* User Type Selection */}
      <div>
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

      {/* Common Fields */}
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <input
        type="text"
        placeholder="College Code"
        value={collegeCode}
        onChange={(e) => setCollegeCode(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Student Fields */}
      {userType === "Student" && (
        <>
          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Year of Study"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
          />
        </>
      )}

      {/* Instructor Fields */}
      {userType === "Instructor" && (
        <>
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />
        </>
      )}

      <button onClick={handleRegister}>Register</button>

      <div className="link-container">
        <span className="link-text" onClick={() => navigate("/login")}>
          Already registered? Log In
        </span>
      </div>
    </div>
  );
};

export default Registration;
