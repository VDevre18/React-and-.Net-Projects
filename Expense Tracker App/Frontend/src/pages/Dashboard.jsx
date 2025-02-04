import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('current-month');
  
  // Get month range based on filter
  const getMonthRange = () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    
    if (selectedFilter === 'previous-month') {
      date.setMonth(date.getMonth() - 1);
    }
    
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return { start, end };
  };

  // Filtered transactions based on month selection
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const { start, end } = getMonthRange();
    return transactionDate >= start && transactionDate <= end;
  });

  // Calculate totals
  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses };
  };

  const { income: totalIncome, expenses: totalExpenses } = calculateTotals();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Pie Chart Data
  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [totalIncome, totalExpenses],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 20,
    }]
  };

  // Chart Options
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value) => {
          const total = totalIncome + totalExpenses;
          return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%';
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 16
        }
      },
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          },
          padding: 20
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Month Filter</InputLabel>
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                label="Month Filter"
              >
                <MenuItem value="current-month">Current Month</MenuItem>
                <MenuItem value="previous-month">Previous Month</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Box sx={{ flex: 1, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4" color="primary">
                ${totalIncome.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4" color="error">
                ${totalExpenses.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 4, 
            borderRadius: 2, 
            height: '500px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" gutterBottom sx={{ alignSelf: 'flex-start' }}>
              Financial Overview ({selectedFilter.replace('-', ' ')})
            </Typography>
            <Box sx={{ 
              width: '80%', 
              height: '400px', 
              position: 'relative',
              margin: '0 auto'
            }}>
              <Pie 
                data={chartData} 
                options={chartOptions} 
                plugins={[ChartDataLabels]}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;