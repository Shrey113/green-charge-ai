import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health and test endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'connected',
    message: 'Backend server is connected and running locally!',
    port: PORT,
    timestamp: new Date().toLocaleTimeString(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
