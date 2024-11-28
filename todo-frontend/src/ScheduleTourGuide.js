import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AppointmentsList from './AppointmentsList'; // Import AppointmentsList
import './SchedulePage.css';

const ScheduleTourGuide = () => {
    const [appointmentDate, setAppointmentDate] = useState('');
    const [driverId, setDriverId] = useState(''); // This should be renamed to tourGuideId for clarity, but leaving as is.
    const [details, setDetails] = useState('');
    const [drivers, setDrivers] = useState([]); // Should be renamed to tourGuides for clarity.

    const navigate = useNavigate(); // Initialize navigate

    // Fetch all tour guides
    const fetchTourGuide = async () => {
        try {
            const response = await axios.get('http://localhost:8000/todos');
            const TourGuideList = response.data.filter(todo => todo.role === 'tour guide');
            setDrivers(TourGuideList); // This should be renamed to setTourGuides for clarity, but leaving as is.
        } catch (error) {
            console.error('Error fetching tour guide:', error);
        }
    };

    // Schedule an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/appointments', {
                todoId: driverId, // Should be tourGuideId, leaving as is.
                appointmentDate,
                details
            });
            alert('Appointment scheduled successfully!');
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        }
    };

    // Fetch tour guides when the component is mounted
    useEffect(() => {
        fetchTourGuide();
    }, []);

    // Navigate back to ClientView.js
    const handleBack = () => {
        navigate('/client-view'); // Adjust route based on your app structure
    };

    return (
        <div className="schedule-page"> {/* Apply the CSS class */}
            <h2 className="schedule-heading">Schedule Tour Guide Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group"> {/* Add form-group class */}
                    <label>Select Tour Guide:</label>
                    <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="form-control"> {/* Add form-control class */}
                        <option value="">Select Tour Guide</option>
                        {drivers.map(driver => (
                            <option key={driver._id} value={driver._id}>{driver.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group"> {/* Add form-group class */}
                    <label>Appointment Date:</label>
                    <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="form-control" /> {/* Add form-control class */}
                </div>

                <div className="form-group"> {/* Add form-group class */}
                    <label>Details:</label>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="form-control" /> {/* Add form-control class */}
                </div>

                <button type="submit" className="schedule-btn">Schedule Appointment</button> {/* Add schedule-btn class */}
            </form>

            {/* Show list of scheduled appointments for the selected tour guide */}
            {/* {driverId && <AppointmentsList todoId={driverId} />} Should be tourGuideId */}

            {/* Back Button */}
            <button onClick={handleBack} className="back-btn">Back</button>
        </div>
    );
};

export default ScheduleTourGuide;
