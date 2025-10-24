// Array of quote objects
const quotes = [
  { text: "Success is no accident.", category: "Motivation" },
  { text: "Do what you can, with what you have.", category: "Inspiration" },
  { text: "Believe you can and you're halfway there.", category: "Motivation" },
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  // ✅ Use innerHTML instead of textContent
  quoteDisplay.innerHTML = `"${quotes[randomIndex].text}" - <em>${quotes[randomIndex].category}</em>`;
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both quote text and category!");
  }
}

// Event listener for showing a new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
