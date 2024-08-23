import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { TextField, Button, Typography, Avatar, Container, Grid, Box, Paper } from '@mui/material';

const Profile = () => {
  const { user, setUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: user?.id || '', 
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!user?.id) { 
      alert('User ID is not available.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${user.id}`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(`Failed to update user: ${errorData.message}`);
      }
  
      const updatedUser = await response.json();
      setUser(updatedUser); 
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`An error occurred while saving your profile: ${error.message}`);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      id: user?.id || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Grid container spacing={2} direction="column" alignItems="center">
        <Grid item>
          <Avatar
            alt="User Avatar"
            src="https://www.bootdey.com/img/Content/avatar/avatar8.png"
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">User Profile</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
            {isEditing ? (
              <Box component="form" noValidate autoComplete="off">
                <Grid item>
                  <Typography variant="body1">User ID: {formData.id}</Typography>
                </Grid>
                <TextField
                  label="Full Name"
                  name="fullName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <TextField
                  label="Gender"
                  name="gender"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.gender}
                  onChange={handleChange}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  style={{ marginTop: '20px', marginLeft: '10px' }}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1">User ID: {user?.id}</Typography>
                <Typography variant="body1">Full Name: {user?.fullName}</Typography>
                <Typography variant="body1">Email: {user?.email}</Typography>
                <Typography variant="body1">Phone Number: {user?.phoneNumber}</Typography>
                <Typography variant="body1">Gender: {user?.gender}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
