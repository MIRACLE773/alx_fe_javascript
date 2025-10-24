// Retrieve quotes or set default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The future belongs to those who prepare for it today.", category: "Motivation" },
  { text: "Faith without works is dead.", category: "Faith" },
  { text: "Consistency beats talent every time.", category: "Success" }
];

// Load last selected filter or default
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Display quotes and populate filter on page load
window.onload = function() {
  populateCategories();
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  filterQuotes();
};

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear old categories
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Add categories dynamically
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Save selected filter
  localStorage.setItem("selectedCategory", selectedCategory);

  // Filter logic
  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  // Show quotes
  quoteDisplay.innerHTML = filteredQuotes
    .map(q => `<p>"${q.text}" — <em>${q.category}</em></p>`)
    .join("");
}

// Add new quote and update everything
function addQuote() {
  const quoteInput = document.getElementById("quoteInput");
  const categoryInput = document.getElementById("categoryInput");
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();
    quoteInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Show random quote (for existing functionality)
function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}" — <em>${randomQuote.category}</em></p>
  `;
}

