import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './MainPage.css';
import profileImage from './defaultProfile.jpg';

const MainPage = () => {
    const [bookedDrivers, setBookedDrivers] = useState([]); // State for booked drivers
    const [bookedTourGuides, setBookedTourGuides] = useState([]); // State for booked tour guides
    const [confirmedAppointments, setConfirmedAppointments] = useState([]); // State for confirmed appointments
    const [driverCount, setDriverCount] = useState(0); // State for driver count
    const [tourGuideCount, setTourGuideCount] = useState(0); // State for tour guide count
    const [myAppointments, setMyAppointments] = useState([]); // State for my appointments

    const navigate = useNavigate();
    const userId = "12345"; // Placeholder user ID (replace with actual authentication mechanism)

    // Fetch all drivers and tour guides and calculate their count
    const fetchBookedDetails = async () => {
        try {
            const driversResponse = await axios.get('http://localhost:8000/todos?role=driver');
            const tourGuidesResponse = await axios.get('http://localhost:8000/todos?role=tour guide');

            // Set the fetched drivers and tour guides
            setBookedDrivers(driversResponse.data);
            setBookedTourGuides(tourGuidesResponse.data);

            // Calculate the count for drivers and tour guides
            setDriverCount(driversResponse.data.length);
            setTourGuideCount(tourGuidesResponse.data.length);
        } catch (error) {
            console.error('Error fetching booked details:', error);
        }
    };

    // Fetch "My Appointments" based on user ID or another identifier
    const fetchMyAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/appointments?userId=${userId}`);
            setMyAppointments(response.data); // Store fetched appointments in state
        } catch (error) {
            console.error('Error fetching my appointments:', error);
        }
    };

    useEffect(() => {
        fetchBookedDetails(); // Fetch drivers and tour guides
        fetchMyAppointments(); // Fetch user-specific appointments

        const storedConfirmedAppointments = JSON.parse(localStorage.getItem('confirmedAppointments')) || [];
        setConfirmedAppointments(storedConfirmedAppointments);
    }, []);

    // Logout function
    const handleLogout = () => {
        navigate('/login');
    };

    // Navigation functions for buttons
    const navigateToAddPage = () => {
        navigate('/home');
    };

    const navigateToTodosPage = () => {
        navigate('/todos');
    };

    return (
        <div className="main-page">
            <header className="header">
                <h1>Driver And Tour Guide Manager</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            <section className="dashboard">
                <h2>Admin Dashboard</h2>
                <div class="totals-container">
  <div class="total-card">
    <h3>Total Drivers</h3>
    <p>{driverCount}</p>
  </div>
  <div class="total-card">
    <h3>Total Tour Guides</h3>
    <p>{tourGuideCount}</p>
  </div>
</div>
 </section>

            <section className="booked-details">
                <h2>Driver Details:</h2>
                <div className="details-grid">
                    {bookedDrivers.map(driver => (
                        <div key={driver._id} className="detail-card">
                            <img src={profileImage} alt="Driver Profile" className="profile-img" />
                            <h3>{driver.title}</h3>
                            <p><strong>Contact:</strong> {driver.contactNumber || 'N/A'}</p>
                            <p><strong>Email:</strong> {driver.email || 'N/A'}</p>
                            <p><strong>NIC:</strong> {driver.nic || 'N/A'}</p>
                        </div>
                    ))}
                </div>

                <h2>Tour Guide Details:</h2>
                <div className="details-grid">
                    {bookedTourGuides.map(guide => (
                        <div key={guide._id} className="detail-card">
                            <img src={profileImage} alt="Tour Guide Profile" className="profile-img" />
                            <h3>{guide.title}</h3>
                            <p><strong>Contact:</strong> {guide.contactNumber || 'N/A'}</p>
                            <p><strong>Email:</strong> {guide.email || 'N/A'}</p>
                            <p><strong>NIC:</strong> {guide.nic || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </section>

         

            <div className="button-group" class="center-buttons">
                <button className="btn navigate-btn" onClick={navigateToAddPage}>
                    Add Driver or Tour Guide
                </button>
                <button className="btn navigate-btn" onClick={navigateToTodosPage}>
                    View All Entries
                </button>
            </div>
        </div>
    );
};

export default MainPage;
