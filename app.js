// Initialize Plaid Link
const handler = Plaid.create({
    env: 'sandbox',
    clientName: 'My Charity',
    key: process.env.PLAID_CLIENT_ID,
    product: ['auth'],
    onSuccess: (publicToken, metadata) => {
      // Send public token to server to exchange for access token
      fetch('/exchange_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicToken: publicToken,
          institutionId: metadata.institution.institution_id
        })
      })
      .then(response => response.json())
      .then(data => {
        // Update account info UI with access token and account ID
        document.getElementById('accountToken').value = data.accessToken;
        document.getElementById('accountId').value = data.accountId;
        document.getElementById('accountName').value = data.accountName;
        // Display success message to user
        document.getElementById('successMessage').classList.remove('is-hidden');
      })
      .catch(error => {
        // Display error message to user
        document.getElementById('errorMessage').classList.remove('is-hidden');
      });
    }
  });
  
  // Add event listener to launch Plaid Link on button click
  document.getElementById('linkButton').addEventListener('click', () => {
    handler.open();
  });
  