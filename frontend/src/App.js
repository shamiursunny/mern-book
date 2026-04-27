import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Base API URL
const API_URL = "http://localhost:5000"; 
// For production later:
// const API_URL = "https://mern-book-y622.onrender.com";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // ✅ Auth form state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // ==============================
  // 🔐 AUTH FUNCTIONS
  // ==============================

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/signup`, authForm);
      alert("Signup successful");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password
      });

      // ✅ Save token
      localStorage.setItem('token', res.data.token);
      alert("Login successful");

      // ✅ Fetch users AFTER login
      fetchUsers();

    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // 📡 FETCH USERS (PROTECTED)
  // ==============================
  const fetchUsers = () => {
    const token = localStorage.getItem('token');

    // ✅ Prevent 401 error
    if (!token) {
      console.log("No token found, skipping fetch");
      return;
    }

    axios.get(`${API_URL}/api/users`, {
      headers: {
        Authorization: token
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  };

  // ✅ Only fetch if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsers();
    }
  }, []);

  // ==============================
  // 📝 FORM HANDLING (CRUD)
  // ==============================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  // ✅ CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login first");
      return;
    }

    if (editingId) {
      axios.put(`${API_URL}/api/users/${editingId}`, form, {
        headers: { Authorization: token }
      })
      .then(res => {
        setUsers(users.map(u => u._id === editingId ? res.data : u));
        setEditingId(null);
        setForm({ name: '', email: '' });
      })
      .catch(err => console.error(err));

    } else {
      axios.post(`${API_URL}/api/users`, form, {
        headers: { Authorization: token }
      })
      .then(res => {
        setUsers([...users, res.data]);
        setForm({ name: '', email: '' });
      })
      .catch(err => console.error(err));
    }
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    axios.delete(`${API_URL}/api/users/${id}`, {
      headers: { Authorization: token }
    })
    .then(() => setUsers(users.filter(u => u._id !== id)))
    .catch(err => console.error(err));
  };

  // ✅ EDIT
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
      <h2>Signup / Login</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleAuthChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleAuthChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleAuthChange}
      />

      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login</button>

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
    </div>
  );
}

export default App;