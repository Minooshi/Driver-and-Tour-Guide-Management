import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; // Added import for useNavigate
import './TodosPage.css';

export default function TodosPage() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [updatedTodo, setUpdatedTodo] = useState({
        title: '',
        description: '',
        email: '',
        dob: '',
        contactNumber: '',
        nic: '',
        role: '',
    });
    const [searchDriver, setSearchDriver] = useState(""); // Search for drivers
    const [searchTourGuide, setSearchTourGuide] = useState(""); // Search for tour guides

    const apiUrl = "http://localhost:8000";

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            })
            .catch(() => {
                setError("Error fetching data");
            });
    };

    const handleDelete = (id) => {
        fetch(apiUrl + `/todos/${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter(todo => todo._id !== id));
                } else {
                    setError("Error deleting item");
                }
            })
            .catch(() => setError("Error deleting item"));
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo._id);
        setUpdatedTodo({
            title: todo.title,
            description: todo.description,
            email: todo.email,
            dob: new Date(todo.dob).toISOString().substr(0, 10),
            contactNumber: todo.contactNumber,
            nic: todo.nic || '',
            role: todo.role,
        });
    };

    const handleUpdate = (id) => {
        fetch(apiUrl + `/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedTodo),
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
                    setEditingTodo(null);
                } else {
                    setError("Error updating item");
                }
            })
            .catch(() => setError("Error updating item"));
    };

    const handleSearchDriver = (e) => {
        setSearchDriver(e.target.value.toLowerCase());
    };

    const handleSearchTourGuide = (e) => {
        setSearchTourGuide(e.target.value.toLowerCase());
    };

    const generateCSV = (data, role) => {
        const csvRows = [];
        const headers = ['Title', 'Description', 'Email', 'DOB', 'Contact', 'NIC'];
        csvRows.push(headers.join(',')); // Add headers to CSV

        data.forEach(item => {
            const values = [
                item.title,
                item.description,
                item.email,
                new Date(item.dob).toLocaleDateString(),
                item.contactNumber,
                item.nic,
            ];
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `${role}-report.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const generateReport = (role, filteredData) => {
        if (filteredData.length === 0) {
            alert(`No ${role}s found for the current search!`);
            return;
        }
        generateCSV(filteredData, role);
        alert(`Report for ${role}s generated and downloaded!`);
    };

    const filteredDrivers = todos.filter(item => 
        item.role === "driver" && (
            item.title.toLowerCase().includes(searchDriver) ||
            item.description.toLowerCase().includes(searchDriver) ||
            item.email.toLowerCase().includes(searchDriver)
        )
    );

    const filteredTourGuides = todos.filter(item => 
        item.role === "tour guide" && (
            item.title.toLowerCase().includes(searchTourGuide) ||
            item.description.toLowerCase().includes(searchTourGuide) ||
            item.email.toLowerCase().includes(searchTourGuide)
        )
    );

    const driverCount = filteredDrivers.length; // Calculate driver count
    const tourGuideCount = filteredTourGuides.length; // Calculate tour guide count

    const navigateToMainPage = () => {
        navigate('/main-page', { state: { driverCount, tourGuideCount } });
    };

    return (
        <div className="todos-container fade-in">
            <h1 className="title">All Entries</h1>
            {error && <p className="error-message">{error}</p>}
            
            <div className="search-section">
                <h2>Drivers</h2>
                <div className="search-with-count">
                    <input
                        type="text"
                        placeholder="Search Drivers"
                        value={searchDriver}
                        onChange={handleSearchDriver}
                        className="form-control search-input"
                    />
                    <span className="count-display">Total number of Drivers: {filteredDrivers.length}</span>
                </div>
                <button className="btn btn-info mb-3" onClick={() => generateReport('driver', filteredDrivers)}>Generate Driver Report</button>
                <ul className="todos-list">
                    {filteredDrivers.map((item) => (
                        <li key={item._id} className="todo-item shadow-sm">
                            {editingTodo === item._id ? (
                                <div className="edit-form">
                                    <input 
                                        type="text" 
                                        value={updatedTodo.title} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <textarea 
                                        value={updatedTodo.description} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })} 
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="email" 
                                        value={updatedTodo.email} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, email: e.target.value })} 
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="date" 
                                        value={updatedTodo.dob} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, dob: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="text" 
                                        value={updatedTodo.contactNumber} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, contactNumber: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="text" 
                                        value={updatedTodo.nic}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, nic: e.target.value })}
                                        className="form-control mb-2"
                                        placeholder="NIC Number"
                                    />
                                    <select
                                        value={updatedTodo.role}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, role: e.target.value })}
                                        className="form-select mb-2"
                                    >
                                        <option value="driver">Driver</option>
                                        <option value="tour guide">Tour Guide</option>
                                    </select>
                                    <button className="btn btn-success me-2" onClick={() => handleUpdate(item._id)}>Save</button>
                                    <button className="btn btn-secondary" onClick={() => setEditingTodo(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <h5 className="todo-title">{item.title}</h5>
                                    <p className="todo-description">{item.description}</p>
                                    <div className="todo-details">
                                        <p>Email: <span>{item.email}</span></p>
                                        <p>DOB: <span>{new Date(item.dob).toLocaleDateString()}</span></p>
                                        <p>Contact: <span>{item.contactNumber}</span></p>
                                        <p>NIC: <span>{item.nic}</span></p>
                                        <p>Role: <span>{item.role}</span></p>
                                    </div>
                                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="search-section">
                <h2>Tour Guides</h2>
                <div className="search-with-count">
                    <input
                        type="text"
                        placeholder="Search Tour Guides"
                        value={searchTourGuide}
                        onChange={handleSearchTourGuide}
                        className="form-control search-input"
                    />
                    <span className="count-display">Total number of Tour Guides: {filteredTourGuides.length}</span>
                </div>
                <button className="btn btn-info mb-3" onClick={() => generateReport('tour guide', filteredTourGuides)}>Generate Tour Guide Report</button>
                <ul className="todos-list">
                    {filteredTourGuides.map((item) => (
                        <li key={item._id} className="todo-item shadow-sm">
                            {editingTodo === item._id ? (
                                <div className="edit-form">
                                    <input 
                                        type="text" 
                                        value={updatedTodo.title} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <textarea 
                                        value={updatedTodo.description} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })} 
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="email" 
                                        value={updatedTodo.email} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, email: e.target.value })} 
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="date" 
                                        value={updatedTodo.dob} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, dob: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="text" 
                                        value={updatedTodo.contactNumber} 
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, contactNumber: e.target.value })}
                                        className="form-control mb-2"
                                    />
                                    <input 
                                        type="text" 
                                        value={updatedTodo.nic}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, nic: e.target.value })}
                                        className="form-control mb-2"
                                        placeholder="NIC Number"
                                    />
                                    <select
                                        value={updatedTodo.role}
                                        onChange={(e) => setUpdatedTodo({ ...updatedTodo, role: e.target.value })}
                                        className="form-select mb-2"
                                    >
                                        <option value="driver">Driver</option>
                                        <option value="tour guide">Tour Guide</option>
                                    </select>
                                    <button className="btn btn-success me-2" onClick={() => handleUpdate(item._id)}>Save</button>
                                    <button className="btn btn-secondary" onClick={() => setEditingTodo(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <h5 className="todo-title">{item.title}</h5>
                                    <p className="todo-description">{item.description}</p>
                                    <div className="todo-details">
                                        <p>Email: <span>{item.email}</span></p>
                                        <p>DOB: <span>{new Date(item.dob).toLocaleDateString()}</span></p>
                                        <p>Contact: <span>{item.contactNumber}</span></p>
                                        <p>NIC: <span>{item.nic}</span></p>
                                        <p>Role: <span>{item.role}</span></p>
                                    </div>
                                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            
        </div>
    );
}
