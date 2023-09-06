// Global variable to store the loaded debt data
let debtall = [];

// Wait for the DOM content to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    attachEventListeners();
    loadHome();
});


function attachEventListeners() {
    document.querySelector('#viewDebt').addEventListener('click', loadDebt);
    document.querySelector('#viewImport').addEventListener('click', loadImport);
    document.querySelector('#importStatement').addEventListener('click', importStatement);
    document.querySelector('#addDebt').addEventListener('click', addDebt);
    document.querySelector('#adddebt-form').onsubmit = addDebtAccount;
}

// Clear form fields and remove validation classes
function clearFormFields(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.querySelector(`#${id}`);
        field.value = '';
        field.classList.remove('is-valid', 'is-invalid');
    });
}


// Switches between different views by showing/hiding elements
function switchView(viewId) {
    const views = ['#home-view', '#debt-view', '#adddebt-view', '#import-view', '#debt-details-view'];
    views.forEach(view => {
        if (view === viewId) {
            document.querySelector(view).style.display = 'block';
        } else {
            document.querySelector(view).style.display = 'none';
        }
    });
}

function loadHome() {
    switchView('#home-view');
}

function loadImport() {
    switchView('#import-view');
}

function createDebtTable(debts) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-hover');

    const headerRow = table.insertRow();
    const headers = ['account', 'amount', 'interest', 'min_pay', 'actions'];
    
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    debts.forEach(debt => {
        const row = table.insertRow();
        const cells = [debt.account, debt.amount, debt.interest, debt.min_pay, ''];
        
        cells.forEach((cellValue, index) => {
            const cell = row.insertCell();
            cell.textContent = cellValue;
            
            // Add a button to the last cell of each row for viewing details
            if (index === cells.length - 1) {
                const viewButton = document.createElement('button');
                viewButton.textContent = 'View Details';
                viewButton.classList.add('btn', 'btn-sm', 'btn-primary');
                viewButton.addEventListener('click', function() {
                    loadDebtDetails(debt); // Load details when the button is clicked
                });
                cell.appendChild(viewButton);
            }
        });
    });

    return table;
}

function addDebt() {
    switchView('#adddebt-view');
}

function addDebtAccount() {
    // Get form field values
    const name = document.querySelector('#name').value;
    const amount = document.querySelector('#amount').value;
    const interest_rate = document.querySelector('#interest_rate').value;
    const min_payment = document.querySelector('#min_payment').value;

    // Send post request to upload a new debt
    fetch('/debt/add', {
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
        // Reload debt data after adding
        loadDebt();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while creating the debt.');
    });

    return false;
}

function loadDebt() {
    switchView('#debt-view');

    fetch('/debt/all')
        .then(response => response.json())
        .then(debt => {
            debtall = debt;
            const table = createDebtTable(debt);
            const debtView = document.querySelector('#debt-view');
            debtView.innerHTML = `
                <h1>Your Debt</h1>
                <button class="btn btn-sm btn-outline-primary" id="addDebt">Add Debt</button>
            `; // Clear existing content
            document.querySelector('#addDebt').addEventListener('click', addDebt);
           
            debtView.appendChild(table);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading debt.');
        });
}

function loadDebtDetails(debt) {
    // Switch to the debt details view
    switchView('#debt-details-view');
    
    // Create and populate a container to display debt details
    const debtDetailsContainer = document.querySelector('#debt-details-view');
    debtDetailsContainer.innerHTML = `
        <h2>${debt.account} Details</h2>
        <p>Account: ${debt.account}</p>
        <p>Amount: ${debt.amount}</p>
        <p>Interest Rate: ${debt.interest}</p>
        <p>Minimum Payment: ${debt.min_pay}</p>
        <!-- Add more details as needed -->
        <button class="btn btn-sm btn-primary" id="back-to-debt">Back to Debt</button>
    `;

    // Add an event listener to the "Back to Debt" button
    document.querySelector('#back-to-debt').addEventListener('click', function() {
        loadDebt(); // Go back to the debt table view
    });
}

function importStatement() {
    // Create an input element for file upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx'; // Allow only Excel files

    // Trigger file input click event when the button is clicked
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file

        if (!file) {
            return; // No file selected, do nothing
        }

        // Read the Excel file
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;

            // Parse the Excel data using SheetJS
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0]; // Assuming you have a single sheet

            // Convert Excel data to JSON
            const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Send the JSON data to the server
            fetch('/statement/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData), // Send the JSON data
            })
            .then(response => response.json())
            .then(result => {
                // Process the response from the server as needed
                console.log(result);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while processing the statement.');
            });
        };

        reader.readAsBinaryString(file);
    });

    // Trigger the file input dialog
    fileInput.click();
}
