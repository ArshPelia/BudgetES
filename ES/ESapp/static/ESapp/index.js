/* when the DOM content of the page has been loaded, 
  we attach event listeners to each of the buttons. 
  
  Ensures use of the function to only run the code once all content has loaded
   
   */
// Wait for the DOM content to load before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadhome();
});

// Switches between different views by showing/hiding elements
function switchView(viewId) {
    const views = ['#home-view','#debt-view','#debtadd-view'];
    views.forEach(view => {
        if (view === viewId) {
            document.querySelector(view).style.display = 'block';
        } else {
            document.querySelector(view).style.display = 'none';
        }
    });
}

function loadhome(){
    switchView('#home-view');
}

function loadDebt(){
  switchView('#debt-view');

}

function loadDebtAdd(){
  switchView('#debtadd-view');

}