/* when the DOM content of the page has been loaded, 
  we attach event listeners to each of the buttons. 
  
  Ensures use of the function to only run the code once all content has loaded
   
   */
// Wait for the DOM content to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#viewDebt').addEventListener('click', loadDebt);
    document.querySelector('#addDebt').addEventListener('click', addDebt);
    document.querySelector('#adddebt-form').onsubmit = addDebtAccount;


    loadHome();
});

// Switches between different views by showing/hiding elements
function switchView(viewId) {
    const views = ['#home-view','#debt-view','#adddebt-view'];
    views.forEach(view => {
        if (view === viewId) {
            document.querySelector(view).style.display = 'block';
        } else {
            document.querySelector(view).style.display = 'none';
        }
    });
}

function loadHome(){
    switchView('#home-view');
}

function loadDebt(){
  switchView('#debt-view');
}

function addDebt(){
    switchView('#adddebt-view');
  }

// Clears form fields and removes validation classes
function clearFormFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.querySelector(`#${id}`);
        field.value = '';
        field.classList.remove('is-valid', 'is-invalid');
    });
}

function addDebtAccount() {
    // Get form field values
    const name = document.querySelector('#name').value;
    const amount = document.querySelector('#amount').value;
    const interest_rate = document.querySelector('#interest_rate').value;
    const min_payment = document.querySelector('#min_payment').value;

    // Send post request to upload a new question
    fetch('/debt/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            amount: amount,
            interest_rate: interest_rate,
            min_payment: min_payment,  
        })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        alert(JSON.stringify(result));
        clearFormFields(['name', 'amount', 'interest_rate', 'min_payment']);

    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the question.');
    });

    return false;
}
