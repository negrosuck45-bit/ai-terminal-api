const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY || "your-secret-key-123";

// Auth middleware
app.use((req, res, next) => {
  if (req.headers.authorization !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.post('/execute', (req, res) => {
  const { command, cwd = '/home/node' } = req.body;
  if (!command) return res.status(400).json({ error: "No command provided" });

  exec(command, { cwd, timeout: 45000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
    res.json({
      success: !error,
      output: (stdout || stderr || "").trim(),
      error: error ? error.message : null
    });
  });
});

app.get('/health', (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Terminal API on port ${PORT}`));
