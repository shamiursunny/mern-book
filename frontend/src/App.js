import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Use environment variable (fallback to localhost)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  // ==============================
  // 🔐 AUTH STATE
  // ==============================

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // ==============================
  // 📊 APP STATE
  // ==============================

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // ==============================
  // 🔐 AUTH FUNCTIONS
  // ==============================

  // ✅ Signup new user
  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/signup`, authForm);
      alert("Signup successful");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  // ✅ Login user
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: authForm.email,
        password: authForm.password
      });

      // ✅ Save JWT token
      localStorage.setItem('token', res.data.token);

      alert("Login successful");

      // ✅ Fetch users after login
      fetchUsers();

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ✅ Logout user
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsers([]);
    alert("Logged out");
  };

  // ==============================
  // 📡 FETCH USERS (PROTECTED)
  // ==============================

  const fetchUsers = () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    axios.get(`${API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}` // ✅ Standard JWT format
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error(err));
  };

  // ✅ Fetch users on page load if token exists
  useEffect(() => {
    fetchUsers();
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
  // ➕ CREATE / ✏️ UPDATE USER
  // ==============================

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login first");
      return;
    }

    // ✅ UPDATE
    if (editingId) {
      axios.put(`${API_URL}/api/users/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUsers(users.map(u => u._id === editingId ? res.data : u));
        setEditingId(null);
        setForm({ name: '', email: '' });
      })
      .catch(err => console.error(err));

    } else {
      // ✅ CREATE
      axios.post(`${API_URL}/api/users`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUsers([...users, res.data]);
        setForm({ name: '', email: '' });
      })
      .catch(err => console.error(err));
    }
  };

  // ==============================
  // ❌ DELETE USER
  // ==============================

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    axios.delete(`${API_URL}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setUsers(users.filter(u => u._id !== id)))
    .catch(err => console.error(err));
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
      <h2>Auth</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleAuthChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleAuthChange}
      />

      {/* ✅ FIXED: password now hidden */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleAuthChange}
      />

      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>

      {/* 📝 USER FORM */}
      <h2>{editingId ? "Update User" : "Add User"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <button type="submit">Submit</button>
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