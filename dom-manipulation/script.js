// Retrieve quotes or set default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The future belongs to those who prepare for it today.", category: "Motivation" },
  { id: 2, text: "Faith without works is dead.", category: "Faith" },
  { id: 3, text: "Consistency beats talent every time.", category: "Success" }
];

let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Initialize app
window.onload = function() {
  populateCategories();
  document.getElementById("categoryFilter").value = lastSelectedCategory;
  filterQuotes();
  startServerSync();
};

// Save quotes locally
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes based on category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");

  const filtered =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = filtered
    .map(q => `<p>"${q.text}" — <em>${q.category}</em></p>`)
    .join("");
}

// Add new quote
function addQuote() {
  const quoteInput = document.getElementById("quoteInput");
  const categoryInput = document.getElementById("categoryInput");
  const text = quoteInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { id: Date.now(), text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    syncWithServer(newQuote); // send new quote to server
    quoteInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Show random quote
function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}" — <em>${randomQuote.category}</em></p>
  `;
}

// 🛰️ Step 1: Fetch simulated data from server
async function fetchServerQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert mock server data to quote structure
    const serverQuotes = data.slice(0, 5).map(post => ({
      id: post.id,
      text: post.title,
      category: "Server"
    }));

    handleServerSync(serverQuotes);
  } catch (error) {
    console.error("Error fetching server data:", error);
  }
}

// 🧩 Step 2: Conflict resolution logic
function handleServerSync(serverQuotes) {
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let conflicts = [];

  // Simple conflict resolution: server overrides local
  serverQuotes.forEach(serverQuote => {
    const localMatch = localQuotes.find(q => q.id === serverQuote.id);
    if (!localMatch) {
      localQuotes.push(serverQuote);
    } else if (localMatch.text !== serverQuote.text) {
      conflicts.push({ local: localMatch, server: serverQuote });
      // Resolve: keep server version
      const index = localQuotes.findIndex(q => q.id === serverQuote.id);
      localQuotes[index] = serverQuote;
    }
  });

  if (conflicts.length > 0) {
    alert("⚠️ Some conflicts were found and resolved using server data.");
  }

  quotes = localQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
}

// 🧠 Step 3: Send new quote to server (simulation)
async function syncWithServer(newQuote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    console.log("✅ Quote synced with server:", newQuote);
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

// 🔁 Step 4: Periodic sync every 15 seconds
function startServerSync() {
  fetchServerQuotes();
  setInterval(fetchServerQuotes, 15000); // every 15 seconds
}
