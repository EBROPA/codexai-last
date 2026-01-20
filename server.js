import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = 'https://codexai.pro';
const SITEMAP_ROUTES = ['/', '/work', '/services', '/contact'];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = SITEMAP_ROUTES.map((route) => {
    const loc = `${BASE_URL}${route}`;
    return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

app.post('/api/contact', async (req, res) => {
  const { name, niche, contact, comment } = req.body;
  
  // Log the request to the console (visible in Render logs)
  console.log('--- NEW CONTACT FORM SUBMISSION ---');
  console.log('Name:', name);
  console.log('Niche:', niche);
  console.log('Contact:', contact);
  console.log('Comment:', comment);
  console.log('Timestamp:', new Date().toISOString());
  console.log('-----------------------------------');

  // Send to Telegram
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (BOT_TOKEN && CHAT_ID) {
    try {
      const message = `
<b>New Contact Form Submission</b>
<b>Name:</b> ${name}
<b>Niche:</b> ${niche}
<b>Contact:</b> ${contact}
<b>Comment:</b> ${comment || 'No comment'}
      `;

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
      } else {
        console.log('Message sent to Telegram successfully');
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  } else {
    console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
  }
  
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
