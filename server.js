import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/contact', (req, res) => {
  const { name, niche, contact } = req.body;
  
  // Log the request to the console (visible in Render logs)
  console.log('--- NEW CONTACT FORM SUBMISSION ---');
  console.log('Name:', name);
  console.log('Niche:', niche);
  console.log('Contact:', contact);
  console.log('Timestamp:', new Date().toISOString());
  console.log('-----------------------------------');

  // Here you would typically send an email using Nodemailer or similar
  
  res.status(200).json({ success: true, message: 'Message received successfully' });
});

// Catch-all handler for any request that doesn't match an API route
// Sends back the React app's index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
