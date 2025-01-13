import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';

const App = () => {
  const [display, setDisplay] = useState('');
  const [isResult, setIsResult] = useState(false); // Track if the current display is a result

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '=', '+',
  ];

  const handleClick = (value) => {
    if (value === 'C') {
      // Clear display and reset state
      setDisplay('');
      setIsResult(false);
    } else if (value === '=') {
      try {
        const result = eval(display); // Calculate result
        setDisplay(result.toString());
        setIsResult(true); // Mark display as a result
      } catch {
        setDisplay('Error'); // Handle invalid expressions
        setIsResult(true);
      }
    } else {
      // If the user starts typing a new number after a result, clear the display
      if (isResult) {
        setDisplay(value);
        setIsResult(false); // Reset isResult
      } else {
        setDisplay(display + value); // Append new input
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#2C2C2C', // Dark Gray background
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          bgcolor: '#F4F4F4', // Light Gray for card background
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            marginBottom: 2,
            fontFamily: 'Georgia, Times New Roman, serif',
            color: '#333333', // Dark Gray for headings
          }}
        >
          Calculator
        </Typography>
        <Box
          sx={{
            bgcolor: '#FFFFFF', // White background for display
            padding: 2,
            borderRadius: 1,
            marginBottom: 2,
            textAlign: 'right',
            color: '#333333', // Dark Gray for text
            fontFamily: 'Roboto, Arial, sans-serif',
          }}
        >
          {display || '0'}
        </Box>
        <Grid container spacing={2}>
          {buttons.map((btn, index) => (
            <Grid item xs={3} key={index}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor:
                    btn === '='
                      ? '#3C8D40' // Emerald Green for equal button
                      : btn === 'C'
                      ? '#FF9F00' // Soft Orange for clear button
                      : '#0A74DA', // Deep Blue for others
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor:
                      btn === '='
                        ? '#3C8D40'
                        : btn === 'C'
                        ? '#FFA500'
                        : '#005F73', // Slightly darker shade for hover
                  },
                }}
                onClick={() => handleClick(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default App;
