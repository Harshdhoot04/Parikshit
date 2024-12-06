import React from "react";
import "../App.css";

// Using const to define Sidebar as an arrow function
const Sidebar = () => {
  return (
    <aside className="filters">
      <h3>Filters</h3>
      <button className="close">Close All</button>
      <label>
        Domain
        <select>
          <option value="">Select</option>
        </select>
      </label>
      <label>
        Provider
        <select>
          <option value="">Select</option>
        </select>
      </label>
      <button className="apply">Apply Filter</button>
    </aside>
  );
};

// Default export of the Sidebar component
export default Sidebar;
