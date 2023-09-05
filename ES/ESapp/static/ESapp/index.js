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

  fetch('/debt/all')
  .then(response => response.json())
  .then(debt => {
      debtall = debt;
      const table = createDebtTable(debt);
      const alldebtView = document.querySelector('#debt-view');
      alldebtView.appendChild(table);
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while loading debt.');
  });
}

// Creates and populates a Debt table
function createDebtTable(debts) {
    console.log('creating debt table')
    
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-hover');

    const headerRow = table.insertRow();
    const headers = ['account', 'amount', 'interest', 'min_pay'];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    debts.forEach(debt => {
        const row = table.insertRow();
        const cells = [debt.account, debt.amount, debt.interest, debt.min_pay];
        cells.forEach(cellValue => {
            const cell = row.insertCell();
            cell.textContent = cellValue;
        });
    });

    return table;
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

    // Send post request to upload a new debt
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
        alert('An error occurred while creating the debt.');
    });

    return false;
}
