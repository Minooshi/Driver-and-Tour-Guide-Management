import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Importing CSS
import bannerImage from './HomePageImage.jpeg'; // Importing an image related to driver and tour guide management

export default function HomePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [nic, setNic] = useState(""); // New state for NIC
    const [role, setRole] = useState("driver"); // New state for role
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // For navigating to another page

    const apiUrl = "http://localhost:8000";

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
        return re.test(email);
    };

    // Contact number validation (10-digit number)
    const validateContactNumber = (number) => {
        const re = /^[0-9]{10}$/; // Example: 10-digit number validation
        return re.test(number);
    };

    // NIC validation (9 digits followed by 'V'/'v' or 'X'/'x')
    const validateNic = (nic) => {
        const nicPattern = /^[0-9]{9}[vVxX]$/;
        return nicPattern.test(nic);
    };

    // Handle form submission
    const handleSubmit = () => {
        setError("");
        // Validations
        if (!title.trim()) {
            setError("Name is required");
            return;
        }
        if (!email.trim() || !validateEmail(email)) {
            setError("Valid email is required");
            return;
        }
        if (!dob.trim()) {
            setError("Date of birth is required");
            return;
        }
        if (!contactNumber.trim() || !validateContactNumber(contactNumber)) {
            setError("Valid contact number is required (10 digits)");
            return;
        }
        if (!nic.trim() || !validateNic(nic)) {
            setError("Valid NIC is required (9 digits followed by 'V', 'v', 'X', or 'x')");
            return;
        }

        // Proceed with submission if validations pass
        fetch(apiUrl + "/todos", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, email, dob, contactNumber, nic, role }) // Include NIC in request body
        }).then((res) => {
            if (res.ok) {
                setMessage("successfully added");
                setTitle("");
                setDescription("");
                setEmail("");
                setDob("");
                setContactNumber("");
                setNic("");
                setRole("driver");
                setTimeout(() => {
                    setMessage("");
                }, 3000);
            } else {
                setError("Unable to create Todo item");
            }
        }).catch(() => {
            setError("Unable to create Todo item");
        });
    };

    const navigateToTodosPage = () => {
        navigate('/todos'); // Navigate to todos page
    };

    return (
        <div className="homepage-container fade-in">
            {/* Image banner */}
            <img src={bannerImage} alt="Driver and Tour Guide Management" className="banner-image" />

            <h1 className="title">Add Driver or Tour Guide</h1>
            {message && <p className="success-message">{message}</p>}
            <div className="form-group">
                <input type="text" className="input-field" placeholder="Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea className="input-field" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="date" className="input-field" value={dob} onChange={(e) => setDob(e.target.value)} />
                <input type="text" className="input-field" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />

                {/* NIC input field */}
                <input
                    type="text"
                    className="input-field"
                    placeholder="National Identity Card Number"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                />

                {/* Role radio buttons */}
                <div className="role-selection">
                    <div className="radio-group">
                        <input type="radio" name="role" value="driver" checked={role === "driver"} onChange={() => setRole("driver")} className="form-check-input" />
                        <label className="form-check-label">Driver</label>
                    </div>
                    <div className="radio-group">
                        <input type="radio" name="role" value="tour guide" checked={role === "tour guide"} onChange={() => setRole("tour guide")} className="form-check-input" />
                        <label className="form-check-label">Tour Guide</label>
                    </div>
                </div>

                <button className="btn submit-btn" onClick={handleSubmit}>Submit</button>
                {error && <p className="error-message">{error}</p>}
            </div>

            <button className="btn view-entries-btn" onClick={navigateToTodosPage}>View All Entries</button>
        </div>
    );
}

