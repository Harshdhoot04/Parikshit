import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./instructor.css";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState([]);
  const [unitName, setUnitName] = useState("");
  const [unitDescription, setUnitDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [hyperlinks, setHyperlinks] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e, setFiles) => {
    const files = Array.from(e.target.files);
    setFiles(files);
  };

  const handleAddUnit = () => {
    if (!unitName || !unitDescription) {
      setErrorMessage("Unit name and description are required.");
      return;
    }
  
    const newUnit = {
      name: unitName,
      description: unitDescription,
      videos: videos.map((file) => file.name),
      pdfs: pdfs.map((file) => file.name),
      hyperlinks: hyperlinks.filter((link) => link.trim() !== ""),
    };
  
    setUnits([...units, newUnit]);
    setUnitName(""); // Reset unit name field
    setUnitDescription(""); // Reset unit description field
    setVideos([]); // Reset videos field
    setPdfs([]); // Reset PDFs field
    setHyperlinks([]); // Reset hyperlinks field
    setErrorMessage(""); // Reset error message
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Make sure there are units before submitting
    if (units.length === 0) {
      setErrorMessage("You must add at least one unit.");
      return;
    }
  
    try {
      const user = getAuth().currentUser;
      if (!user) {
        setErrorMessage("You must be logged in to create a course.");
        return;
      }
  
      const db = getDatabase();
      const instructorName = user.displayName || "Unknown Instructor";
      const courseData = {
        name: courseName,
        description,
        units,
        instructorName,
        createdAt: new Date().toISOString(),
      };
  
      const coursesRef = ref(db, "courses");
      await push(coursesRef, courseData);
  
      // Update state with the newly created course
      setCreatedCourses([...createdCourses, courseData]);
  
      // Show success message
      setSuccessMessage("Course created successfully!");
  
      // Reset form after success
      setCourseName("");
      setDescription("");
      setUnits([]);
      setVideos([]);
      setPdfs([]);
      setHyperlinks([]);
      setUnitName("");
      setUnitDescription("");
  
      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Error creating course. Please try again.");
      console.error("Error creating course:", error);
    }
  };
  

  return (
    <div className="create-course-form">
      <h1>Create Course</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <label>
            Course Name:
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="unit-section">
          <h2>Add Unit</h2>
          <label>
            Unit Name:
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              required
            />
          </label>
          <label>
            Unit Description:
            <textarea
              value={unitDescription}
              onChange={(e) => setUnitDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Upload Videos:
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, setVideos)}
            />
          </label>
          <label>
            Upload PDFs:
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setPdfs)}
            />
          </label>
          <label>
            Add Hyperlinks:
            <input
              type="text"
              value={hyperlinks.join(", ")}
              onChange={(e) => setHyperlinks(e.target.value.split(", "))}
            />
          </label>
          <button type="button" onClick={handleAddUnit}>
            Add Unit
          </button>
        </div>

        <div className="unit-list">
          <h2>Units</h2>
          {units.map((unit, index) => (
            <div key={index} className="unit-box">
              <h3>{unit.name}</h3>
              <p>{unit.description}</p>
              <p>{unit.videos.length} Video(s)</p>
              <p>{unit.pdfs.length} PDF(s)</p>
              <p>{unit.hyperlinks.length} Hyperlink(s)</p>
            </div>
          ))}
        </div>

        <button type="submit">Add Course</button>
      </form>

      <div className="created-courses">
        <h2>Created Courses</h2>
        {createdCourses.map((course, index) => (
          <div key={index} className="course-box">
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <h4>Units</h4>
            {course.units.map((unit, unitIndex) => (
              <div key={unitIndex} className="unit-box">
                <h5>{unit.name}</h5>
                <p>{unit.description}</p>
                <p>{unit.videos.length} Video(s)</p>
                <p>{unit.pdfs.length} PDF(s)</p>
                <p>{unit.hyperlinks.length} Hyperlink(s)</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCourse;
