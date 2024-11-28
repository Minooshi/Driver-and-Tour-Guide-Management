import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AppointmentsList = ({ todoId, onAccept, onDecline }) => {
    const [appointments, setAppointments] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [details, setDetails] = useState('');
    const [confirmedAppointments, setConfirmedAppointments] = useState([]); // State for confirmed appointments
    const navigate = useNavigate(); // Initialize navigate

    // Fetch appointments for a specific driver or tour guide
    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/appointments/${todoId}`);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
        // Load confirmed appointments from local storage
        const storedConfirmedAppointments = JSON.parse(localStorage.getItem('confirmedAppointments')) || [];
        setConfirmedAppointments(storedConfirmedAppointments);
    }, [todoId]);

    // Update appointment
    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8000/appointments/${id}`, {
                appointmentDate,
                details
            });
            setEditMode(null);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    // Delete appointment
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/appointments/${id}`);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    // Check if driver is already booked for the selected date
    const isDriverAvailable = (appointmentDate) => {
        return !confirmedAppointments.some(appointment => 
            appointment.todoId === todoId && 
            new Date(appointment.appointmentDate).toLocaleDateString() === new Date(appointmentDate).toLocaleDateString()
        );
    };

    // Handle Accept button click
    const handleAccept = (id, userId) => {
        const acceptedAppointment = appointments.find(appointment => appointment._id === id); // Get the accepted appointment

        // Check if the driver is already booked for the selected date
        if (!isDriverAvailable(acceptedAppointment.appointmentDate)) {
            alert('Driver is already booked for this date.');
            return;
        }

        onAccept(id, userId);
        setConfirmedAppointments((prev) => {
            const updatedConfirmed = [...prev, acceptedAppointment]; // Store the entire appointment object
            // Update local storage with confirmed appointments
            localStorage.setItem('confirmedAppointments', JSON.stringify(updatedConfirmed));
            return updatedConfirmed; // Add to confirmed appointments
        });

        // Navigate to ClientView with confirmation message and appointment details
        navigate('/client-view', {
            state: {
                confirmationMessage: 'Your appointment has been confirmed!',
                confirmedAppointmentDetails: acceptedAppointment
            }
        });
    };

    return (
        <div>
            <h3>Appointments</h3>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((appointment) => (
                    <div key={appointment._id}>
                        {editMode === appointment._id ? (
                            <div>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                />
                                <textarea
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                                <button onClick={() => handleUpdate(appointment._id)}>Update</button>
                                <button onClick={() => setEditMode(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Details:</strong> {appointment.details}
                                </p>
                              
                                {/* Accept button to confirm appointment */}
                                <button 
                                    onClick={() => handleAccept(appointment._id, appointment.userId)} 
                                    disabled={!isDriverAvailable(appointment.appointmentDate)}
                                >
                                    Accept
                                </button>
                                <button onClick={() => handleDelete(appointment._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default AppointmentsList;
