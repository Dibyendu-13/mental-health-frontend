import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom'; // useNavigate for navigation
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const CreateDiscussionPage = () => {
  const navigate = useNavigate();  // useNavigate for navigating to new page
  const [topic, setTopic] = useState(''); // State to hold the topic (discussion title)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (topic.trim()) {
      try {
        setLoading(true);
        // Create a new discussion using the topic as the discussion title
        const response = await axios.post(
          `https://anony-backend.onrender.com/api/discussions/${topic}`,  // Route with the topic as part of the URL
          {},  // No body required, as the topic itself is used as the title
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,  // Authorization header
            },
          }
        );
        console.log('Discussion created:', response);
        // Navigate to the newly created discussion page
        navigate(`/discussions/${topic}`);  // Navigate to the newly created discussion
      } catch (err) {
        setError('Failed to create discussion. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please enter a valid topic.');
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', marginTop: 3, padding: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Create a New Discussion with Topic
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Topic (Discussion Title)"
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}  // Handle new topic input
            sx={{ marginBottom: 2 }}
          />
          {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Discussion'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateDiscussionPage;
