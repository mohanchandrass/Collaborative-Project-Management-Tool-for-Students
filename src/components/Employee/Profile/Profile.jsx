import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/employees/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setEmployee(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError("Error fetching profile");
          console.error("Error fetching profile:", error);
        });
    } else {
      setLoading(false);
      setError("No token found");
      console.error("No token found");
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {employee.name}
        </p>
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Employee ID:</strong> {employee.employeeId}
        </p>
      </div>
    </div>
  );
};

export default Profile;
