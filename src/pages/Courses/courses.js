import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { auth } from "../config/firebase"; // Import auth from firebase config
import { useNavigate } from "react-router-dom"; // For navigation
import "../App.css";

const Courses = () => {
  const [courses, setCourses] = useState([]); // State to hold courses data
  const [loading, setLoading] = useState(true); // Loading state
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]); // State for enrolled courses
  const navigate = useNavigate(); // For navigation

  // Fetch courses from Firebase
  const fetchCourses = async () => {
    const db = getDatabase();
    const courseRef = ref(db, "courses");

    try {
      const snapshot = await get(courseRef);
      if (snapshot.exists()) {
        const coursesData = snapshot.val();
        console.log("Fetched courses data:", coursesData);

        // Convert the object to an array while keeping nested properties intact
        const coursesArray = Object.keys(coursesData).map((key) => ({
          id: key,
          ...coursesData[key],
        }));

        setCourses(coursesArray); // Set courses in state
        console.log("Processed courses array:", coursesArray);
      } else {
        console.log("No courses found in database.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false); // Make sure loading is set to false when the fetch completes
    }
  };

  // Fetch user enrolled courses from Firebase
  const fetchEnrolledCourses = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not logged in");
      return;
    }

    const db = getDatabase();
    const enrolledCoursesRef = ref(db, `users/${user.uid}/enrolledCourses`);

    try {
      const snapshot = await get(enrolledCoursesRef);
      if (snapshot.exists()) {
        const enrolledCoursesData = snapshot.val();
        console.log("Fetched user enrolled courses:", enrolledCoursesData);

        // Get array of enrolled course IDs
        const enrolledCoursesArray = Object.keys(enrolledCoursesData).filter(
          (key) => enrolledCoursesData[key] === true
        );

        setUserEnrolledCourses(enrolledCoursesArray); // Set enrolled courses
      } else {
        console.log("User has no enrolled courses.");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  // Fetch both courses and user enrolled courses when the component mounts
  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle enroll action
  const handleEnroll = async (courseId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to enroll in courses.");
      navigate("/login");
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}/enrolledCourses`);
    const updates = {};
    updates[courseId] = true; // Mark this course as enrolled

    try {
      // Update the enrolled courses for the user
      await set(userRef, updates);

      // Update the userEnrolledCourses state to reflect the new enrollment
      setUserEnrolledCourses((prevCourses) => [...prevCourses, courseId]);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="courses">
      <div className="search-bar">
        <input type="text" placeholder="Search For Courses" />
        <button>Search</button>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <div>No courses available</div>
        ) : (
          courses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-icon"></div>
              <div className="course-details">
                <h4>{course.name}</h4>
                <p className="instructor">{course.instructorName}</p>
                <p className="description">{course.description}</p>
                <p className="course-id">Course Id - {course.id}</p>

                {/* Enroll Button */}
                {userEnrolledCourses.includes(course.id) ? (
                  <div>
                    <h5>Access PDFs and Videos</h5>
                    <p>PDFs: {course.pdfs ? course.pdfs : "None"}</p>
                    <p>Videos: {course.videos ? course.videos : "None"}</p>
                  </div>
                ) : (
                  <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Courses;
