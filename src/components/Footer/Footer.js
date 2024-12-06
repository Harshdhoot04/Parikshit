import React from "react";
import "../App.css";

// Using const declaration for the Footer component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>Learn More</h4>
        <p>About Us</p>
        <p>Blogs</p>
        <p>Services</p>
        <p>Terms of Use</p>
      </div>
      <div className="footer-section">
        <h4>Get In Touch</h4>
        <p>abc@gmail.com</p>
        <p>xyz@gmail.com</p>
      </div>
      <div className="footer-section">
        <h4>Our Newsletter</h4>
        <p>
          Subscribe to our newsletter to get our news & details delivered to
          you.
        </p>
        <input type="email" placeholder="Email Address" />
        <button>Join</button>
      </div>
    </footer>
  );
};

// Default export of the Footer component
export default Footer;
