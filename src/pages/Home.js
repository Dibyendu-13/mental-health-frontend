import React, { useEffect, useState } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        console.log('Fetched data:', data); // Log the fetched data to check its structure
        if (Array.isArray(data)) {
          setPosts(data); // Only set if the response is an array
        } else {
          console.error('API did not return an array:', data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <Container sx={{ marginTop: 4 }}>
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
      <Box>
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No posts available.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home;
