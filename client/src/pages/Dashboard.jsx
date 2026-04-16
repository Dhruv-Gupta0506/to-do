import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        createdAt: new Date().toISOString().split('T')[0]
    });

    // 1. GET: Fetch all tasks on page load
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get('/lists');
                setTasks(response.data);
            } catch (error) {
                // If JWT is expired or cookie is missing, redirect to Login
                if (error.response?.status === 401) navigate('/');
            }
        };
        fetchTasks();
    }, [navigate]);

    // LOGOUT LOGIC (Handles JWT/Cookie removal)
    const handleLogout = async () => {
        try {
            // Tell the backend to clear the cookie
            await axiosInstance.post('/auth/logout');
            alert("Logged out successfully!");
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
            // Even if the backend call fails, we force redirect to Login
            navigate('/');
        }
    };

    // INPUT HANDLER
    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    // 2. POST: Add a new task
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.name.trim()) return alert("Name is required");
        try {
            const response = await axiosInstance.post('/lists', {
                ...newTask,
                completed: false
            });
            setTasks([...tasks, response.data]);
            setNewTask({ name: '', description: '', createdAt: new Date().toISOString().split('T')[0] });
        } catch (error) {
            alert("Error adding task");
        }
    };

    // 3. PATCH: Toggle completion status
    const toggleComplete = async (id, currentStatus) => {
        try {
            const response = await axiosInstance.patch(`/lists/${id}`, {
                completed: !currentStatus
            });
            setTasks(tasks.map(task => task._id === id ? response.data : task));
        } catch (error) {
            alert("Error updating task");
        }
    };

    // 4. DELETE: Remove task
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await axiosInstance.delete(`/lists/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            alert("Error deleting task");
        }
    };

    return (
        <div className="dashboard-page">
            {/* LOGOUT BUTTON */}
            <div className="top-bar">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <h1>Task Dashboard</h1>

            {/* ADD TASK FORM */}
            <form onSubmit={handleAddTask} className="add-task-form">
                <input name="name" placeholder="Name" value={newTask.name} onChange={handleInputChange} />
                <input name="description" placeholder="Description" value={newTask.description} onChange={handleInputChange} />
                <input type="date" name="createdAt" value={newTask.createdAt} onChange={handleInputChange} />
                <button type="submit">Add Task</button>
            </form>

            {/* TASK LIST DISPLAY */}
            <div className="task-container">
                {tasks.map((task) => (
                    <div key={task._id} className="task-card">
                        <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.name}
                        </h3>
                        <p>{task.description}</p>
                        <small>{new Date(task.createdAt).toLocaleDateString()}</small>
                        
                        <div className="task-actions">
                            <button onClick={() => toggleComplete(task._id, task.completed)}>
                                {task.completed ? "Mark Pending" : "Mark Done"}
                            </button>
                            <button onClick={() => handleDelete(task._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;