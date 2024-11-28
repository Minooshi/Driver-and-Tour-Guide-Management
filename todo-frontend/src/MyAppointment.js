import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentsList from './AppointmentsList'; // Import the AppointmentsList component
import './MyAppointment.css'; // Optional CSS for styling

const MyAppointment = () => {
    const [drivers, setDrivers] = useState([]);
    const [tourGuides, setTourGuides] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [selectedTourGuideId, setSelectedTourGuideId] = useState('');
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    // Fetch all drivers and tour guides
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/todos');
            const driverList = response.data.filter(user => user.role === 'driver');
            const tourGuideList = response.data.filter(user => user.role === 'tour guide');

            setDrivers(driverList);
            setTourGuides(tourGuideList);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/todos/${userId}`);
            setSelectedUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Accept request function
    const handleAccept = (id) => {
        console.log(`Accepted request with ID: ${id}`);
    };

    // Decline request function
    const handleDecline = (id) => {
        console.log(`Declined request with ID: ${id}`);
    };

    return (
        <div className="my-appointments">
            <h2>Show Appointments</h2>

            {/* Overview section */}
            {selectedUserDetails && (
                <div className="user-details">
                    <h3>{selectedUserDetails.name}</h3>
                    
                </div>
            )}

            <div className="appointments-selection">
                <div className="form-group">
                    <label>Select Driver's Name:</label>
                    <select 
                        value={selectedDriverId} 
                        onChange={(e) => {
                            setSelectedDriverId(e.target.value);
                            fetchUserDetails(e.target.value);
                        }} 
                        className="form-control"
                    >
                        <option value="">Select Driver</option>
                        {drivers.map(driver => (
                            <option key={driver._id} value={driver._id}>
                                {driver.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Select Tour Guide's Name:</label>
                    <select 
                        value={selectedTourGuideId} 
                        onChange={(e) => {
                            setSelectedTourGuideId(e.target.value);
                            fetchUserDetails(e.target.value);
                        }} 
                        className="form-control"
                    >
                        <option value="">Select Tour Guide</option>
                        {tourGuides.map(tourGuide => (
                            <option key={tourGuide._id} value={tourGuide._id}>
                                {tourGuide.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Driver Appointments */}
            {selectedDriverId && (
                <div className="appointments-section">
                    <h3>Driver Appointments</h3>
                    <AppointmentsList 
                        todoId={selectedDriverId} 
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        allowEditDelete={false} // Pass this prop to conditionally render buttons
                    />
                </div>
            )}

            {/* Tour Guide Appointments */}
            {selectedTourGuideId && (
                <div className="appointments-section">
                    <h3>Tour Guide Appointments</h3>
                    <AppointmentsList 
                        todoId={selectedTourGuideId} 
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        allowEditDelete={false} // Pass this prop to conditionally render buttons
                    />
                </div>
            )}
        </div>
    );
};

export default MyAppointment;
