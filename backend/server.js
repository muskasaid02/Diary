const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('Hello from the backend!');
});

// Start the server on port 5000
const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


