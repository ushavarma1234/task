import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { TextField, Button, Typography, Avatar, Container, Grid, Box, Paper } from '@mui/material';

const Profile = () => {
  const { user } = useUser();

  // State for managing edit mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
  });

  // Handle edit click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle save click
  const handleSaveClick = () => {
    // Logic to save the updated user data goes here (e.g., API call)
    setIsEditing(false);
  };

  // Handle cancel click
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
    });
  };

  // Handle form field changes
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
              <Box style={{ textAlign: 'center' }}>
                <Typography variant="h6">Name: {user?.fullName}</Typography>
                <Typography variant="body1">Email: {user?.email}</Typography>
                <Typography variant="body1">Phone Number: {user?.phoneNumber}</Typography>
                <Typography variant="body1">Gender: {user?.gender}</Typography>
                <Button
                  type="button"
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
