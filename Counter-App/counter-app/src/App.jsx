import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#2C2C2C', // Dark Gray / Charcoal for background
        color: '#FFFFFF',   // White for text
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: 'Georgia, Times New Roman, serif',
          color: '#FFFFFF', // White for headings
        }}
      >
        Counter App
      </Typography>
      <Typography
        variant="h1"
        sx={{
          marginBottom: 2,
          fontFamily: 'Georgia, Times New Roman, serif',
        }}
      >
        {count}
      </Typography>
      <Box>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0A74DA', // Deep Blue for primary buttons
            color: '#FFFFFF',
            marginRight: 1,
            '&:hover': {
              backgroundColor: '#005F73', // Slightly darker on hover
            },
          }}
          onClick={() => setCount(count + 1)}
        >
          Increment
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF9F00', // Soft Orange for secondary actions
            color: '#FFFFFF',
            marginRight: 1,
            '&:hover': {
              backgroundColor: '#FFA500',
            },
          }}
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: '#3C8D40', // Emerald Green for reset
            color: '#3C8D40',
            '&:hover': {
              backgroundColor: '#3C8D40',
              color: '#FFFFFF',
            },
          }}
          onClick={() => setCount(0)}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default App;
