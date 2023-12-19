import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const App = () => {
  const [token, setToken] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    // Fetch user token (you might want to implement a login component)
    // For simplicity, assume a hardcoded token
    const userToken = 'your_hardcoded_token';
    setToken(userToken);

    // Fetch user's notes
    axios.get(`${API_URL}/notes`, { headers: { Authorization: userToken } })
      .then(response => setNotes(response.data))
      .catch(error => console.error('Error fetching notes:', error));
  }, []);

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    setNewNote({ ...newNote, [name]: value });
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();

    axios.post(`${API_URL}/notes`, newNote, { headers: { Authorization: token } })
      .then(response => {
        setNotes([...notes, response.data]);
        setNewNote({ title: '', content: '' });
      })
      .catch(error => console.error('Error creating note:', error));
  };

  const handleNoteDelete = (id) => {
    axios.delete(`${API_URL}/notes/${id}`, { headers: { Authorization: token } })
      .then(() => setNotes(notes.filter(note => note._id !== id)))
      .catch(error => console.error('Error deleting note:', error));
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Note</Link></li>
          </ul>
        </nav>

        <Route path="/" exact>
          <h2>Notes</h2>
          <ul>
            {notes.map(note => (
              <li key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => handleNoteDelete(note._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </Route>

        <Route path="/create">
          <h2>Create Note</h2>
          <form onSubmit={handleNoteSubmit}>
            <label>
              Title:
              <input type="text" name="title" value={newNote.title} onChange={handleNoteChange} />
            </label>
            <br />
            <label>
              Content:
              <textarea name="content" value={newNote.content} onChange={handleNoteChange} />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </Route>
      </div>
    </Router>
  );
};

export default App;
