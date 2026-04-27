import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Base API URL
const API_URL = "https://mern-book-y622.onrender.com";
// For production:
// const API_URL = "https://mern-book-y622.onrender.com";
// For local development:
// const API_URL = "http://localhost:5000";


function App() {

  // ==============================
  // 🔹 STATE MANAGEMENT
  // ==============================

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // 🔐 Auth state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // ==============================
  // 🔐 AUTH FUNCTIONS
  // ==============================

  // ✅ Signup
  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/signup`, authForm);
      alert("Signup successful");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password
      });

      // ✅ Save token
      localStorage.setItem('token', res.data.token);

      // ✅ Set login state
      setIsLoggedIn(true);

      alert("Login successful");

      // ✅ Fetch users after login
      fetchUsers();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsers([]);
    alert("Logged out");
  };


  // ==============================
  // 📡 FETCH USERS (PROTECTED)
  // ==============================

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}` // ✅ STANDARD FORMAT
        }
      });

      setUsers(res.data);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };


  // ✅ Auto login check on page load
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
      fetchUsers();
    }
  }, []);


  // ==============================
  // 📝 FORM HANDLING
  // ==============================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };


  // ==============================
  // 📝 CREATE / UPDATE USER
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await axios.put(
          `${API_URL}/api/users/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUsers(users.map(u => u._id === editingId ? res.data : u));
        setEditingId(null);

      } else {
        // CREATE
        const res = await axios.post(
          `${API_URL}/api/users`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setUsers([...users, res.data]);
      }

      setForm({ name: '', email: '' });

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };


  // ==============================
  // 🗑 DELETE USER
  // ==============================

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(u => u._id !== id));

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };


  // ==============================
  // ✏️ EDIT USER
  // ==============================

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email });
  };


  // ==============================
  // 🎨 UI
  // ==============================

  return (
    <div style={{ padding: '20px' }}>
      <h1>MERN Users</h1>

      {/* 🔐 AUTH SECTION */}
      {!isLoggedIn ? (
        <>
          <h2>Signup / Login</h2>

          <input type="text" name="name" placeholder="Name" onChange={handleAuthChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleAuthChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleAuthChange} />

          <button onClick={handleSignup}>Signup</button>
          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>

          {/* 📝 USER FORM */}
          <h2>{editingId ? "Update User" : "Add User"}</h2>

          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={form.name} 
              onChange={handleChange} 
            />

            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
            />

            <button type="submit">
              {editingId ? 'Update User' : 'Add User'}
            </button>
          </form>

          {/* 📋 USER LIST */}
          <h2>User List</h2>
          <ul>
            {users.map(user => (
              <li key={user._id}>
                {user.name} - {user.email}
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;