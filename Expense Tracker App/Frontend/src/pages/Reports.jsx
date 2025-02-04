import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Typography,
  Container,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import axios from "../axiosConfig";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "chart.js/auto";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Register the plugin globally
Chart.register(ChartDataLabels);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const generatePieData = () => {
    const categories = {};
    transactions.forEach((transaction) => {
      categories[transaction.category] =
        (categories[transaction.category] || 0) + transaction.amount;
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#E7E9ED",
            "#8B572A",
          ],
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 20,
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          return `${((value / total) * 100).toFixed(1)}%`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
      },
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#fff",
      },
    },
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Type", "Category", "Amount", "Date"],
      ...transactions.map((t) => [
        t.type,
        t.category,
        t.amount,
        new Date(t.date).toLocaleDateString(),
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "transactions.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 15);

    const tableData = transactions.map((t) => [
      t.type,
      t.category,
      `$${t.amount.toFixed(2)}`,
      new Date(t.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Type", "Category", "Amount", "Date"]],
      body: tableData,
      startY: 20,
    });

    doc.save("transactions.pdf");
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>

          <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={exportToCSV}>
              Export to CSV
            </Button>
            <Button variant="contained" color="secondary" onClick={exportToPDF}>
              Export to PDF
            </Button>
          </Box>

          <Box sx={{ mb: 4, height: "600px" }}>
            <Typography variant="h6" gutterBottom>
              Category Distribution
            </Typography>
            <Pie
              data={generatePieData()}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Transaction List
          </Typography>
          <List>
            {transactions.map((transaction) => (
              <ListItem key={transaction.transactionId}>
                <ListItemText
                  primary={`${transaction.type} - ${transaction.category}`}
                  secondary={`$${transaction.amount.toFixed(2)} - ${new Date(
                    transaction.date
                  ).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
};

export default Reports;
