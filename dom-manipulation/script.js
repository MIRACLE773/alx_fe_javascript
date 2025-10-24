// Load existing quotes from local storage or use default ones
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House", category: "coding" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire", category: "engineering" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "productivity" }
];

// === Step 1: Simulate fetching data from server ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert first few posts into server quotes
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      author: `Server Author ${item.id}`,
      category: "server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// === Step 2: Simulate posting new quote to server ===
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// === Step 3: Conflict Resolution (merge + server wins) ===
function resolveConflicts(localQuotes, serverQuotes) {
  // Avoid duplicates and let server data override
  const combined = [...localQuotes];

  serverQuotes.forEach(sq => {
    const exists = combined.find(lq => lq.text === sq.text);
    if (!exists) combined.push(sq);
  });

  return combined;
}

// === Step 4: Sync Quotes ===
async function syncQuotes() {
  console.log("🔄 Syncing quotes...");
  const serverQuotes = await fetchQuotesFromServer();

  // Merge and resolve conflicts
  const mergedQuotes = resolveConflicts(quotes, serverQuotes);

  // Update local storage
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;

  // Update UI
  showRandomQuote();

  // Notify user
  const notification = document.getElementById("syncStatus");
  if (notification) {
    notification.textContent = "Quotes synced with server!";
  } else {
    alert("Quotes synced with server!");
  }

  console.log("Quotes synced with server!");
}

// === Step 5: Show Random Quote ===
function showRandomQuote() {
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("quoteText").textContent = `"${random.text}"`;
  document.getElementById("quoteAuthor").textContent = `- ${random.author}`;
}

// === Step 6: Periodically Sync Every 10 Seconds ===
setInterval(syncQuotes, 10000);

// === Step 7: Manual Sync Button ===
document.getElementById("syncButton").addEventListener("click", syncQuotes);

// === Step 8: Initial Load ===
window.onload = () => {
  showRandomQuote();
  syncQuotes();
};
