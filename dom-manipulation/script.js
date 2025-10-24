// Array of quotes
let quotes = [
  { text: "The future belongs to those who prepare for it today.", category: "Motivation" },
  { text: "Faith can move mountains.", category: "Faith" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Function to add a new quote dynamically
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill in both fields before adding a quote.");
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newText, category: newCategory });

  // Update DOM immediately
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `"${newText}" — [${newCategory}]`;

  // Clear input fields
  textInput.value = "";
  categoryInput.value = "";
}