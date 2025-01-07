import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  Box,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import axios from 'axios';

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasVoted, setHasVoted] = useState(false); 
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voteResponse = await axios.get(
          `https://anony-backend.onrender.com/api/posts/${post._id}/vote-status`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setHasVoted(voteResponse.data.hasVoted);

        const commentsResponse = await axios.get(
          `https://anony-backend.onrender.com/api/posts/${post._id}/comments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setComments(commentsResponse.data.comments);
      } catch (err) {
        console.error('Failed to fetch data:', err.response?.data?.error || err.message);
      }
    };

    fetchData();
  }, [post._id]);

  const handleVote = async (action) => {
    try {
      const { data } = await axios.post(
        `https://anony-backend.onrender.com/api/posts/${post._id}/likes`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLikes(data.likes);
      setHasVoted(true); 
    } catch (err) {
      console.error('Failed to update vote:', err.response?.data?.error || err.message);
    }
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        const { data } = await axios.post(
          `https://anony-backend.onrender.com/api/posts/${post._id}/comments`,
          { content: comment },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setComments((prev) => [...prev, data]);
        setComment('');
      } catch (err) {
        console.error('Failed to add comment:', err.response?.data?.error || err.message);
      }
    }
  };

  const handleChatRequest = async (commenterId) => {
    setLoading(true);
    try {
      await axios.post(
        `https://anony-backend.onrender.com/api/chat-requests/request`,
        { commenterId, postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Chat request sent successfully!');
    } catch (err) {
      console.error('Failed to send chat request:', err.response?.data?.error || err.message);
      alert('Failed to send chat request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ display: 'flex', marginBottom: 3, borderRadius: 4, boxShadow: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F7F7',
          padding: 2,
        }}
      >
        <IconButton
          onClick={() => handleVote('upvote')}
          color="primary"
          size="large"
          disabled={hasVoted}
        >
          <ArrowDropUp />
        </IconButton>
        <Typography variant="h6" color="textSecondary">
          {likes}
        </Typography>
        <IconButton
          onClick={() => handleVote('downvote')}
          color="secondary"
          size="large"
          disabled={hasVoted}
        >
          <ArrowDropDown />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color: '#6C63FF' }}>
            {post.title}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
            Posted by: {post.author.username}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            {post.content}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
            {post.tags.map((tag, index) => (
              <Chip key={index} label={`#${tag}`} size="small" sx={{ backgroundColor: '#6C63FF', color: '#FFFFFF' }} />
            ))}
          </Stack>
          

          {/* New button to create a discussion */}
          <Button component={Link} to={`/create-discussion/${post._id}`} variant="outlined" color="secondary" size="small" sx={{ marginTop: 1 }}>
            Create Discussion
          </Button>
        </CardContent>

        <Divider />

        <Box sx={{ padding: 2 }}>
          <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
            Comments:
          </Typography>
          <Box>
            {comments.map((comment) => (
              <Box
                key={comment._id}
                sx={{
                  marginBottom: 1,
                  padding: 1,
                  backgroundColor: '#F9F9FF',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {comment.author?.username || 'Unknown User'}
                </Typography>
                <Typography variant="body2">{comment.content}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  disabled={loading}
                  onClick={() => handleChatRequest(comment.author?._id)}
                  sx={{ marginTop: 1 }}
                >
                  Request Chat
                </Button>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleAddComment} variant="contained" color="primary" sx={{ marginLeft: 1 }}>
              Post
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
