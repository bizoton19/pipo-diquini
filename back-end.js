const express = require('express');
const { Configuration, PlaidApi, Products, PlaidEnvironments} = require('plaid');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Plaid client
const client = new plaid.Client({
  // Insert your Plaid API keys here
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_CLIENT_ID,
  env: process.env.PLAID_ENV || 'sandbox',
});

// Use body-parser middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve index.html as the default page
app.use(express.static('public'));

// Endpoint for exchanging public token for access token and account details
app.post('/exchange_token', async (req, res) => {
  try {
    const { publicToken, institutionId } = req.body;
    const exchangeResponse = await client.exchangePublicToken(publicToken);
    const accessToken = exchangeResponse.access_token;
    const accountsResponse = await client.getAccounts(accessToken);
    const account = accountsResponse.accounts.find(a => a.type === 'checking');
    const accountId = account.account_id;
    const accountName = account.name;
    res.json({
      accessToken,
      accountId,
      accountName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error exchanging token');
  }
});

// Endpoint for initiating a donation
app.post('/make_donation', async (req, res) => {
  try {
    const { donationAmount, accessToken, accountId } = req.body;
    const donation = {
      account_id: accountId,
      amount: {
        value: donationAmount.toString(),
        currency: 'USD',
      },
    };
    const paymentResponse = await client.createPayment(accessToken, donation);
    if (paymentResponse.payment.status === 'pending') {
      res.send('Donation successful!');
    } else {
      res.status(500).send('Error making donation');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error making donation');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
