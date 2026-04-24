import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch users
  useEffect(() => {
    axios.get('https://mern-book-y622.onrender.com/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new or updated user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // UPDATE
      axios.put(`https://mern-book-y622.onrender.com/api/users/${editingId}`, form)
        .then(res => {
          setUsers(users.map(u => u._id === editingId ? res.data : u));
          setEditingId(null);
          setForm({ name: '', email: '' });
        })
        .catch(err => console.error(err));
    } else {
      // CREATE
      axios.post('https://mern-book-y622.onrender.com/api/users', form)
        .then(res => {
          setUsers([...users, res.data]);
          setForm({ name: '', email: '' });
        })
        .catch(err => console.error(err));
    }
  };

  // Delete user
  const handleDelete = (id) => {
    axios.delete(`https://mern-book-y622.onrender.com/api/users/${id}`)
      .then(() => setUsers(users.filter(u => u._id !== id)))
      .catch(err => console.error(err));
  };

  // Start editing
  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MERN Users</h1>

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
        <button type="submit">{editingId ? 'Update User' : 'Add User'}</button>
      </form>

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
