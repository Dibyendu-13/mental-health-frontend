import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const DiscussionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column', // Stack elements vertically
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-5px)',
  },
  backgroundColor: '#f9f9f9',
  cursor: 'pointer',
  minHeight: '150px', // Ensures there's enough height for content
}));

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [discussionRooms, setDiscussionRooms] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('API did not return an array:', data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchDiscussionRooms = async () => {
      try {
        const { data } = await api.get('/discussion-rooms');
        if (Array.isArray(data)) {
          setDiscussionRooms(data);
        } else {
          console.error('API did not return an array of discussion rooms:', data);
        }
      } catch (error) {
        console.error('Error fetching discussion rooms:', error);
      }
    };

    fetchPosts();
    fetchDiscussionRooms();
  }, []);

  return (
    <Container sx={{ marginTop: 4, paddingX: 2 }}>
      <Grid container spacing={4}>
        {/* Available Discussion Rooms (Left-aligned to the left side of the screen) */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: 3,
              backgroundColor: '#f5f5f5',
              marginTop: 10, // Add margin to the top for better spacing
              marginRight: 3, // Add margin to the right to create spacing
              marginBottom: 3, // Add margin to the bottom for better spacing
               marginLeft:-6
            }}
          >
            <Typography
              variant="h5"
              color="black"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 3,
              }}
            >
              Available Discussion Rooms
            </Typography>

            {discussionRooms.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                {discussionRooms.map((room) => (
                  <DiscussionCard key={room._id}>
                    <Box sx={{ width: '100%', marginBottom: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {room.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Topic: {room.topic}
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <Button
                        component={Link}
                        to={`/discussions/${room.topic}`}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: '20px',
                          paddingX: 2,
                          paddingY: 1,
                          minWidth: '120px',
                          alignSelf: 'flex-start', // Left-align button
                        }}
                      >
                        Join Discussion
                      </Button>
                    </Box>
                  </DiscussionCard>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No discussion rooms available.
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Post Section (Centered horizontally) */}
        <Grid item xs={12} md={9}>
          <Box sx={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: '900px' }}>
              <Typography
                variant="h4"
                color="black"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                Explore Posts
              </Typography>

              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} sx={{ marginBottom: 3 }} />
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                  No posts available.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
