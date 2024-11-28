import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import TodosPage from './TodosPage';
import MainPage from './MainPage'; // Import MainPage component
import ScheduleDriver from './ScheduleDriver'; // Import ScheduleDriver component
import ScheduleTourGuide from './ScheduleTourGuide'; // Import ScheduleTourGuide component
import MyAppointment from './MyAppointment'; // Import MyAppointment component
import ClientView from './ClientView';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {/* Main page route */}
                    <Route path="/" element={<MainPage />} /> {/* Set MainPage as the default route */}

                     {/* Homepage to add todos */}
                    <Route path="/home" element={<HomePage />} /> 

                    {/* Page to view todos */}
                    <Route path="/todos" element={<TodosPage />} />

                    {/* Page to view MY Appointment */}
                    <Route path="/my-appointment" element={<MyAppointment />} />
 
                   {/* Page to view client view */}
                   <Route path="/client-view" element={<ClientView />} />


                    {/* Schedule appointment for drivers */}
                    <Route path="/schedule-driver" element={<ScheduleDriver />} />

                    {/* Schedule appointment for tour guides */}
                    <Route path="/schedule-tourguide" element={<ScheduleTourGuide />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
