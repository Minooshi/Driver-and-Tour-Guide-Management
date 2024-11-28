import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClientView.css'; // Assuming you have a CSS file for styling

const ClientView = () => {
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object to access passed state

  const scheduleDriverAppointment = () => {
    // Logic to direct to driver scheduling form
    navigate('/schedule-driver');
  };

  const scheduleTourGuideAppointment = () => {
    // Logic to direct to tour guide scheduling form
    navigate('/schedule-tourguide');
  };

  const goBackToSchedulePage = () => {
    // Logic to go back to the initial scheduling page
    navigate('/client-view');
  };

  const checkAppointmentStatus = () => {
    // Logic to check if the appointment was accepted (can be retrieved from the backend)
    const accepted = true; // This would come from the backend response
    if (accepted) {
      setAppointmentStatus('Your appointment has been accepted!');
    } else {
      setAppointmentStatus('Your appointment is pending.');
    }
  };

  useEffect(() => {
    // Check if there is state passed from AppointmentsList
    if (location.state) {
      const { confirmationMessage, confirmedAppointmentDetails } = location.state;
      setAppointmentStatus(confirmationMessage); // Set confirmation message
      // Logic to handle confirmedAppointmentDetails (if you want to display it)
      if (confirmedAppointmentDetails) {
        setUpcomingAppointments((prev) => {
          // Check for duplicates before adding
          const isDuplicate = prev.some(appointment => appointment._id === confirmedAppointmentDetails._id);
          return isDuplicate ? prev : [...prev, confirmedAppointmentDetails]; // Add if not a duplicate
        });
      }
    }
    // Fetch other appointments if needed
  }, [location.state]); // Run effect when location.state changes

  return (
    <div className="client-view">
      <h2>Client Dashboard</h2>

      {/* Schedule Appointment Section */}
      <div className="schedule-appointment">
        <h3>Schedule a New Appointment</h3>
        <div className="button-group">
          <button className="btn schedule-btn" onClick={scheduleDriverAppointment}>
            Schedule for Drivers
          </button>
          <button className="btn schedule-btn" onClick={scheduleTourGuideAppointment}>
            Schedule for Tour Guides
          </button>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="upcoming-appointments">
        <h3>Upcoming Appointments</h3>
        {upcomingAppointments.length > 0 ? (
          <ul>
            {upcomingAppointments.map((appointment) => (
              <li key={appointment._id}>
                <strong>{appointment.driverName || appointment.tourGuideName}</strong> {/* Display the driver's or tour guide's name */}
                <p>
                  Date: {new Date(appointment.appointmentDate).toLocaleDateString()} {/* Display the appointment date */}
                </p>
                <p>
                  Details: {appointment.details} {/* Display additional details */}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>

      {/* Appointment Status Message */}
      {appointmentStatus && (
        <div className="appointment-status">
          <p>{appointmentStatus}</p>
        </div>
      )}

    </div>
  );
};

export default ClientView;
