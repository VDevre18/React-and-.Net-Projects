import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // Get user ID from token with proper claim handling
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleAuthError();
      return null;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Correct claim name for ASP.NET Core Identity
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (error) {
      console.error('Error decoding token:', error);
      handleAuthError();
      return null;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      handleRequestError(error, 'Failed to fetch transactions');
    }
  };

  const handleAuthError = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleRequestError = (error, message) => {
    console.error(`${message}:`, error);
    if (error.response?.status === 401) {
      handleAuthError();
    } else {
      setError(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  const handleAddOrUpdateTransaction = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!category || !amount || !date) {
      setError('Please fill in all required fields');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError('Session expired. Please login again.');
      setTimeout(() => handleAuthError(), 2000);
      return;
    }

    const transactionData = {
      type,
      category,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      UserId: userId // Match backend's expected property name
    };

    try {
      if (editId) {
        await axios.put(`/transactions/${editId}`, transactionData);
      } else {
        await axios.post('/transactions', transactionData);
      }
      await fetchTransactions();
      resetForm();
    } catch (error) {
      handleRequestError(error, 'Failed to save transaction');
      
      if (error.response?.data?.errors) {
        const serverErrors = Object.values(error.response.data.errors).flat();
        setError(serverErrors.join('\n'));
      }
    }
  };

  const handleEdit = (transaction) => {
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount.toString());
    setDate(transaction.date.split('T')[0]);
    setEditId(transaction.transactionId);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (error) {
      handleRequestError(error, 'Failed to delete transaction');
    }
  };

  const resetForm = () => {
    setType('Income');
    setCategory('');
    setAmount('');
    setDate('');
    setEditId(null);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Transactions
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleAddOrUpdateTransaction}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              fullWidth
              required
            />

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
              fullWidth
              required
              inputProps={{ 
                step: "0.01",
                min: "0.01"
              }}
            />

            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              margin="normal"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0]
              }}
            />

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2, mb: 4 }}
            >
              {editId ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </form>

          <List>
            {transactions.map((transaction) => (
              <ListItem key={transaction.transactionId}>
                <ListItemText
                  primary={`${transaction.type} - ${transaction.category}`}
                  secondary={
                    <>
                      <span>Amount: ${transaction.amount.toFixed(2)}</span>
                      <br />
                      <span>Date: {new Date(transaction.date).toLocaleDateString()}</span>
                    </>
                  }
                />
                <IconButton 
                  onClick={() => handleEdit(transaction)}
                  color="primary"
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(transaction.transactionId)}
                  color="error"
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
};

export default Transactions;