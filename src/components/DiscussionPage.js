import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import socket from './socket'; // Ensure you have a socket instance

const DiscussionPage = () => {
  const token = localStorage.getItem('token');
  const { discussionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem('userId');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));

  useEffect(() => {
    // Listen for the initial messages from the socket after joining the room
    socket.emit('join-discussion', { discussionId:discussionId, userId: currentUserId });

    // Listen for new messages
    socket.on('new-discussion-message', (newMessage) => {
      console.log('Received new message:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Fetch initial messages for the discussion topic
    socket.emit('fetch-discussion-messages', discussionId);

    // Listen for the initial messages sent from the server
    socket.on('initial-discussion-messages', (initialMessages) => {
      setMessages(initialMessages);
    });

    return () => {
      socket.off('new-discussion-message');
      socket.off('initial-discussion-messages');
    };
  }, [discussionId, currentUserId]);

  const handleSendMessage = () => {
    if (message.trim() && currentUserId) {
      setLoading(true);
      const messageData = {
        discussionId: discussionId,
        username: decodedToken.username,
        senderId:  "45",
        content: message,
      };

      socket.emit('send-discussion-message', messageData);

      setMessage('');
      setLoading(false);
    } else {
      console.error('User is not authenticated or message is empty');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 2 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, textAlign: 'center' }}>
          Discussion
        </Typography>
         Topic: {discussionId}
        <Divider sx={{ marginBottom: 2 }} />

        <Box sx={{ flex: 1, overflowY: 'scroll', marginBottom: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: msg.sender === currentUserId ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                marginBottom: 1,
                justifyContent: 'space-between',
              }}
            >

              <Box
                sx={{
                  backgroundColor: msg.sender === currentUserId ? '#dcf8c6' : '#ffffff',
                  borderRadius: 2,
                  padding: 2,
                  maxWidth: '75%',
                  boxShadow: 1,
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'inline-block',
                  boxSizing: 'border-box',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {msg.username}
                </Typography>
                <Typography variant="body2">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{
              borderRadius: 2,
              padding: 1,
              backgroundColor: '#f5f5f5',
              marginBottom: 2,
              boxSizing: 'border-box',
            }}
          />
          <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '20px',
              padding: '10px 20px',
              backgroundColor: '#25D366',
              '&:hover': {
                backgroundColor: '#128C7E',
              },
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DiscussionPage;
