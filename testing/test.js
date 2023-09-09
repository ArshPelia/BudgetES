const XLSX = require('xlsx');

function readExcelAndDeduceColumns(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  let dateColumnIndex = -1;
  let descriptionColumnIndex = -1;
  let withdrawalColumnIndex = -1;
  let depositColumnIndex = -1;
  let balanceColumnIndex = -1;

  // Function to determine if a cell contains a valid date
  function isValidDate(value) {
    return !isNaN(Date.parse(value));
  }

  // Iterate through rows and cells to deduce columns
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const cellValue = row[columnIndex];

      if (isValidDate(cellValue)) {
        dateColumnIndex = columnIndex;
      } else if (typeof cellValue === 'string') {
        descriptionColumnIndex = columnIndex;
      } else if (typeof cellValue === 'number') {
        if (balanceColumnIndex === -1) {
          // If the cell is a number and balance column is not set, assume it's the balance column
          balanceColumnIndex = columnIndex;
        } else if (withdrawalColumnIndex === -1) {
          // If withdrawal column is not set, assume it's the first non-balance number column
          withdrawalColumnIndex = columnIndex;
        } else {
          // If both balance and withdrawal columns are set, assume the next number column is deposit
          depositColumnIndex = columnIndex;
        }
      }
    }

    // If we've deduced all columns, exit the loop
    if (
      dateColumnIndex !== -1 &&
      descriptionColumnIndex !== -1 &&
      withdrawalColumnIndex !== -1 &&
      depositColumnIndex !== -1 &&
      balanceColumnIndex !== -1
    ) {
      break;
    }
  }

  // Now you can process the data using the deduced column indexes
  for (let row of data) {
    const date = row[dateColumnIndex];
    const description = row[descriptionColumnIndex];
    const withdrawal = withdrawalColumnIndex !== -1 ? row[withdrawalColumnIndex] : null;
    const deposit = depositColumnIndex !== -1 ? row[depositColumnIndex] : null;
    const balance = row[balanceColumnIndex];

    // Process the data as needed
    console.log(`Date: ${date}, Description: ${description}, Withdrawal: ${withdrawal}, Deposit: ${deposit}, Balance: ${balance}`);
  }
}

// Usage example
readExcelAndDeduceColumns('C:\\GitHub\\Budget-ES\\BudgetES\\ES\\Datasets\\Randomize.csv');
