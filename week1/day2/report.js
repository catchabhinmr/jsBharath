const expenses = [
  { description: "Rent", amount: 1200, category: "housing", date: "2026-09-01" },
  { description: "Groceries", amount: 84.5, category: "food", date: "2026-09-03" },
  { description: "Coffee", amount: 4.75, category: "food", date: "2026-09-04" },
  { description: "Bus pass", amount: 64, category: "transport", date: "2026-09-05" },
  { description: "Rent", amount: 1200, category: "housing", date: "2026-10-01" },
  { description: "Groceries", amount: 97.25, category: "food", date: "2026-10-02" },
  { description: "Concert", amount: 55, category: "fun", date: "2026-10-03" },
  { description: "Coffee", amount: 5.5, category: "food", date: "2026-10-04" },
];
total = expenses.reduce((sum, e) => sum + e.amount, 0);
//by category
totalHousing = expenses.filter(e => e.category === "housing").reduce((sum, e) => sum + e.amount, 0);
totalTransport = expenses.filter(e => e.category === "transport").reduce((sum, e) => sum + e.amount, 0);
totalFun = expenses.filter(e => e.category === "fun").reduce((sum, e) => sum + e.amount, 0);
totalFood = expenses.filter(e => e.category === "food").reduce((sum, e) => sum + e.amount, 0);

//Largest
largestRent = expenses.reduce((maximum, e) => Math.max(maximum, e.amount), -Infinity);
console.log(`Total: ${total.toFixed(2)}`);
console.log("By Category:");
console.log(`  housing`.padEnd(10) + `${totalHousing.toFixed(2)}`.padStart(10));
console.log(`  food`.padEnd(10) + `${totalFood.toFixed(2)}`.padStart(10));
console.log(`  transport`.padEnd(10) + `${totalTransport.toFixed(2)}`.padStart(10));
console.log(`  fun`.padEnd(10) + `${totalFun.toFixed(2)}`.padStart(10));
console.log(`Largest: Rent (${largestRent})`);
