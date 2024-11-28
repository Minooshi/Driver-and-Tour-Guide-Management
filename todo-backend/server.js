const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('DB Connected!');
    })
    .catch((err) => {
        console.log('Error connecting to DB:', err);
    });

// Creating Schema for Todos (including NIC field)
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String,
    email: {
        required: true,
        type: String
    },
    dob: {
        required: true,
        type: Date
    },
    contactNumber: {
        required: true,
        type: String
    },
    nic: {  // Added NIC field to schema
        required: true,
        type: String
    },
    role: {  // Role field for driver or tour guide
        required: true,
        type: String,
        enum: ['driver', 'tour guide']
    }
});

// Creating Schema for Appointments
const appointmentSchema = new mongoose.Schema({
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Todo'
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    details: String
});

// Creating models
const Todo = mongoose.model('Todo', todoSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description, email, dob, contactNumber, nic, role } = req.body;  // Include NIC

    try {
        const newTodo = new Todo({ title, description, email, dob, contactNumber, nic, role });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Get all todo items (optional filter by role)
app.get('/todos', async (req, res) => {
    const role = req.query.role;

    try {
        const filter = role ? { role } : {};
        const todos = await Todo.find(filter);
        res.json(todos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update a todo item (including NIC)
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description, email, dob, contactNumber, nic, role } = req.body;  // Include NIC
        const id = req.params.id;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, email, dob, contactNumber, nic, role },  // Update with NIC
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Todo.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Create a new appointment
app.post('/appointments', async (req, res) => {
    const { todoId, appointmentDate, details } = req.body;

    try {
        // Check if the driver/tour guide is already booked on the same date
        const existingAppointment = await Appointment.findOne({
            todoId,
            appointmentDate: {
                $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),  // Start of the day
                $lt: new Date(appointmentDate).setHours(23, 59, 59, 999) // End of the day
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Driver or tour guide is already booked for this date.' });
        }

        const newAppointment = new Appointment({ todoId, appointmentDate, details });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Get appointments for a specific todo (driver/tour guide)
app.get('/appointments/:todoId', async (req, res) => {
    const todoId = req.params.todoId;

    try {
        const appointments = await Appointment.find({ todoId });
        res.json(appointments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Update an appointment
app.put('/appointments/:id', async (req, res) => {
    const id = req.params.id;
    const { appointmentDate, details } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { appointmentDate, details },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(updatedAppointment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Appointment.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const port = 8000;
app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start the server: ', err);
    } else {
        console.log('Server is listening on port ' + port);
    }
});
