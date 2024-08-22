import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import { UserProvider } from '../src/context/UserContext';


function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="" element={<Register />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
