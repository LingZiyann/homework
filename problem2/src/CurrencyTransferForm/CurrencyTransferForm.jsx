import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import dummydata from "../dummydata.json";

function CurrencyTransferForm() {

  
  const [formData, setFormData] = useState({
    fromWallet: "",
    toWallet: "",
    fromCurrency: "USD",
    toCurrency: "USD",
    sendingAmount: "",
    convertedAmount: "",
    timeTaken: "",
    transactionCost: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setError("");

    if (name === "fromCurrency" || name === "sendingAmount") {
      const currencyPrice =
        dummydata.find((item) => item.currency === newFormData.fromCurrency)
          ?.price || 1;
      newFormData.convertedAmount = (
        newFormData.sendingAmount * currencyPrice
      ).toFixed(2);
    }

    setFormData(newFormData);
  };

  const handleSwap = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fromWallet: prevFormData.toWallet,
      toWallet: prevFormData.fromWallet,
      fromCurrency: prevFormData.toCurrency,
      toCurrency: prevFormData.fromCurrency,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.fromWallet || !formData.toWallet || !formData.sendingAmount) {
      setError("Please fill in all fields.");
      return;
    }
    console.log("Transaction Details:", formData);
    setFormData({
      ...formData,
      timeTaken: "10 minutes",
      transactionCost: "1.5 USD",
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                From
              </Typography>
              <TextField
                fullWidth
                label="Wallet Address"
                name="fromWallet"
                value={formData.fromWallet}
                onChange={handleChange}
                margin="normal"
                error={!!error}
                helperText={error && "Invalid input"}
              />
              <TextField
                select
                fullWidth
                label="Currency"
                name="fromCurrency"
                value={formData.fromCurrency}
                onChange={handleChange}
                margin="normal"
              >
                {dummydata.map((option) => (
                  <MenuItem key={option.currency} value={option.currency}>
                    {option.currency}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Amount to Send"
                name="sendingAmount"
                type="number"
                value={formData.sendingAmount}
                onChange={handleChange}
                margin="normal"
              />
              <Typography>
                Amount in USD: ${formData.convertedAmount}
              </Typography>
            </Grid>

            {/* To Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                To
              </Typography>
              <TextField
                fullWidth
                label="Wallet Address"
                name="toWallet"
                value={formData.toWallet}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                select
                fullWidth
                label="Currency"
                name="toCurrency"
                value={formData.toCurrency}
                onChange={handleChange}
                margin="normal"
              >
                {dummydata.map((option) => (
                  <MenuItem key={option.currency} value={option.currency}>
                    {option.currency}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Tooltip title="Swap From and To fields">
                <Button
                  variant="contained"
                  onClick={handleSwap}
                  sx={{ margin: 2 }}
                >
                  Swap
                </Button>
              </Tooltip>
              <Button type="submit" variant="contained" color="primary">
                Calculate Cost
              </Button>
            </Grid>

            {/* Transaction Details */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Calculate Cost
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Typography>Time Taken: {formData.timeTaken}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Transaction Cost: {formData.transactionCost}
              </Typography>
            </Grid>
          </Grid>
        </form>
        
      </Paper>
    </Container>
  );
}

export default CurrencyTransferForm;
