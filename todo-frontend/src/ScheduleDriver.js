import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SchedulePage.css';

const ScheduleDriver = () => {
    const [appointmentDate, setAppointmentDate] = useState('');
    const [driverId, setDriverId] = useState('');
    const [details, setDetails] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // Error message state
    const navigate = useNavigate(); // Initialize navigate

    // Fetch all drivers
    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/todos');
            const driverList = response.data.filter(todo => todo.role === 'driver');
            setDrivers(driverList);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    // Schedule an appointment
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            const response = await axios.post('http://localhost:8000/appointments', {
                todoId: driverId,
                appointmentDate,
                details
            });
            alert('Appointment scheduled successfully!');
            navigate('/client-view'); // Redirect to client view after successful scheduling
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message); // Set error message from backend
            } else {
                setErrorMessage('Error scheduling appointment.');
            }
            console.error('Error scheduling appointment:', error);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    return (
        <div className="schedule-page">
            <h2 className="schedule-heading">Schedule Driver Appointment</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Driver:</label>
                    <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="form-control">
                        <option value="">Select Driver</option>
                        {drivers.map(driver => (
                            <option key={driver._id} value={driver._id}>{driver.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Appointment Date:</label>
                    <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="form-control" />
                </div>

                <div className="form-group">
                    <label>Details:</label>
                    <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="form-control" />
                </div>

                <button type="submit" className="schedule-btn">Schedule Appointment</button>
            </form>
        </div>
    );
};

export default ScheduleDriver;
