document.getElementById("calculateBtn").onclick=calculateExpense;
function calculateExpense() {
    let materialCost = parseInt(document.getElementById("materials").value);
    let quantity = parseInt(document.getElementById("quantity").value);
    let locationrent = parseInt(document.getElementById("location").value);
    let total=(materialCost * quantity)+locationrent;
    document.getElementById("result").innerHTML = "Total Expense: " + total;
    console.log("Button clicked!")
}
function menuToggle() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}