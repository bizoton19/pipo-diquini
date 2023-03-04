// Initialize Plaid Link
const handler = Plaid.create({
    env: 'sandbox',
    clientName: 'My Charity',
    key: '',
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

  // add event listenter to redirect to https://www.gofundme.com/f/7ee4q5-help-haitis-children?qid=f103764ed968726af36b95015bee2491 on donateButton click
  document.getElementById('donateButton').addEventListener('click', ()=>{
    window.location.href = "https://www.gofundme.com/f/donate-in-memory-of-pipo-salomon-the-cofounder?utm_source=customer&utm_medium=copy_link&utm_campaign=p_cf+share-flow-1";
  });
  
  // Add event listener to launch Plaid Link on button click
  document.getElementById('linkButton').addEventListener('click', () => {
    handler.open();
  });
  