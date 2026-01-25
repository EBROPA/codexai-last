import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import 'dotenv/config';
import multer from 'multer';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize Prisma Client with error handling
let prisma = null;
let dbConnected = false;

try {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  // Test database connection
  prisma.$connect()
    .then(() => {
      dbConnected = true;
      console.log('[Database] Connected successfully to PostgreSQL');
    })
    .catch((err) => {
      console.error('[Database] Failed to connect:', err.message);
      console.log('[Database] Image upload will be disabled');
    });
} catch (err) {
  console.error('[Database] Failed to initialize Prisma:', err.message);
}

// Configure multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
const PORT = process.env.PORT || 3001;
const BASE_URL = 'https://codexai.pro';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'codexai-indexnow-key';

// All routes for sitemap with metadata
const SITEMAP_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/work', priority: '0.8', changefreq: 'weekly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/web', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/bots', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/ai', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/complex', priority: '0.8', changefreq: 'monthly' },
  { path: '/services/tma', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/reputation', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/custom', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/direct', priority: '0.7', changefreq: 'monthly' },
  { path: '/services/tgads', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' }
];

// Bot User-Agent patterns for prerendering
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'slurp',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'gptbot',
  'chatgpt-user',
  'perplexitybot',
  'claudebot',
  'google-extended',
  'applebot-extended',
  'ia_archiver',
  'embedly',
  'quora link preview',
  'outbrain',
  'pinterest',
  'vkshare',
  'w3c_validator'
];

// Bot detection middleware
const isBotRequest = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://codexai.pro', 'https://www.codexai.pro']
    : true,
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Content Security Policy headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.telegram.org https://*.supabase.co https://mc.yandex.ru; " +
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://rutube.ru https://mc.yandex.ru https://yandex.ru; " +
    "frame-ancestors 'self';"
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Prerender middleware for bots - serve static HTML with full content
app.use(async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  if (isBotRequest(userAgent)) {
    // Check if prerendered HTML exists
    const prerenderPath = path.join(__dirname, 'prerendered', `${req.path === '/' ? 'index' : req.path.replace(/\//g, '_')}.html`);

    if (fs.existsSync(prerenderPath)) {
      console.log(`[Prerender] Serving prerendered HTML for bot: ${userAgent.substring(0, 50)}`);
      return res.sendFile(prerenderPath);
    }

    // Fall back to index.html with injected meta tags
    console.log(`[Bot Detected] ${userAgent.substring(0, 50)} - ${req.path}`);
  }

  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

// API Routes

// Enhanced robots.txt with AI bots
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml

# AI Crawlers - explicit allow
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandexbot
Allow: /
`);
});

// Enhanced sitemap with lastmod and priority
app.get('/sitemap.xml', (req, res) => {
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = SITEMAP_ROUTES.map((route) => {
    const loc = `${BASE_URL}${route.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// IndexNow verification file
app.get(`/${INDEXNOW_KEY}.txt`, (req, res) => {
  res.type('text/plain');
  res.send(INDEXNOW_KEY);
});

// IndexNow ping endpoint
app.post('/api/indexnow', async (req, res) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'urls array is required' });
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'codexai.pro',
        key: INDEXNOW_KEY,
        urlList: urls.map(url => url.startsWith('http') ? url : `${BASE_URL}${url}`)
      })
    });

    if (response.ok) {
      console.log('[IndexNow] Successfully pinged:', urls);
      res.json({ success: true, message: 'URLs submitted to IndexNow' });
    } else {
      const error = await response.text();
      console.error('[IndexNow] Error:', error);
      res.status(500).json({ error: 'IndexNow API error' });
    }
  } catch (error) {
    console.error('[IndexNow] Request failed:', error);
    res.status(500).json({ error: 'Failed to ping IndexNow' });
  }
});

// =====================================================
// IMAGE UPLOAD API
// =====================================================

// Check database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: dbConnected,
    message: dbConnected ? 'Database connected' : 'Database not available. Please configure DATABASE_URL environment variable.'
  });
});

// Helper function to create optimized thumbnail
async function createThumbnail(buffer) {
  try {
    const thumbnail = await sharp(buffer)
      .resize(400, 300, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toBuffer();

    return thumbnail;
  } catch (error) {
    console.error('[Thumbnail] Error creating thumbnail:', error.message);
    return null;
  }
}

// Upload image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    // Check if database is available
    if (!prisma || !dbConnected) {
      console.error('[Image Upload] Database not connected. DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
      return res.status(503).json({
        error: 'Database not available. Please configure DATABASE_URL on Render.com',
        details: 'Go to Render Dashboard -> Your Web Service -> Environment -> Add DATABASE_URL from your PostgreSQL service'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const alt = req.body.alt || '';

    // Create optimized thumbnail for fast loading in lists
    const thumbnailBuffer = await createThumbnail(buffer);

    // Save image to database with thumbnail
    const image = await prisma.image.create({
      data: {
        filename: originalname,
        mimeType: mimetype,
        size: size,
        data: buffer,
        thumbnailData: thumbnailBuffer,
        thumbnailSize: thumbnailBuffer ? thumbnailBuffer.length : null,
        alt: alt,
      },
    });

    console.log(`[Image Upload] Saved image: ${originalname} (${size} bytes, thumbnail: ${thumbnailBuffer ? thumbnailBuffer.length : 0} bytes)`);

    res.json({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        mimeType: image.mimeType,
        size: image.size,
        alt: image.alt,
        url: `/api/images/${image.id}`,
        thumbnailUrl: `/api/images/${image.id}?size=thumb`,
        createdAt: image.createdAt,
      },
    });
  } catch (error) {
    console.error('[Image Upload] Error:', error.message);
    console.error('[Image Upload] Stack:', error.stack);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Get image by ID (supports ?size=thumb for thumbnail)
app.get('/api/images/:id', async (req, res) => {
  try {
    if (!prisma || !dbConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;
    const { size } = req.query;

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // If thumbnail requested and available, serve it
    if (size === 'thumb' && image.thumbnailData) {
      res.set({
        'Content-Type': 'image/webp',
        'Content-Length': image.thumbnailSize,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      });
      return res.send(Buffer.from(image.thumbnailData));
    }

    // Set proper content type, CORS and cache headers
    res.set({
      'Content-Type': image.mimeType,
      'Content-Length': image.size,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });

    res.send(Buffer.from(image.data));
  } catch (error) {
    console.error('[Image Get] Error:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
});

// List all images (for admin panel)
app.get('/api/images', async (req, res) => {
  try {
    if (!prisma || !dbConnected) {
      return res.status(503).json({ error: 'Database not available', images: [] });
    }

    const images = await prisma.image.findMany({
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        alt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      images: images.map((img) => ({
        ...img,
        url: `/api/images/${img.id}`,
      })),
    });
  } catch (error) {
    console.error('[Image List] Error:', error);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Delete image by ID
app.delete('/api/images/:id', async (req, res) => {
  try {
    if (!prisma || !dbConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const { id } = req.params;

    await prisma.image.delete({
      where: { id },
    });

    console.log(`[Image Delete] Deleted image: ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('[Image Delete] Error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Generate thumbnails for existing images that don't have them
app.post('/api/images/generate-thumbnails', async (req, res) => {
  try {
    if (!prisma || !dbConnected) {
      return res.status(503).json({ error: 'Database not available' });
    }

    // Find images without thumbnails
    const imagesWithoutThumbnails = await prisma.image.findMany({
      where: {
        thumbnailData: null,
      },
      select: {
        id: true,
        filename: true,
        data: true,
      },
    });

    console.log(`[Thumbnails] Found ${imagesWithoutThumbnails.length} images without thumbnails`);

    let processed = 0;
    let failed = 0;

    for (const image of imagesWithoutThumbnails) {
      try {
        const thumbnailBuffer = await createThumbnail(Buffer.from(image.data));

        if (thumbnailBuffer) {
          await prisma.image.update({
            where: { id: image.id },
            data: {
              thumbnailData: thumbnailBuffer,
              thumbnailSize: thumbnailBuffer.length,
            },
          });
          processed++;
          console.log(`[Thumbnails] Generated thumbnail for: ${image.filename}`);
        } else {
          failed++;
        }
      } catch (err) {
        console.error(`[Thumbnails] Failed for ${image.filename}:`, err.message);
        failed++;
      }
    }

    res.json({
      success: true,
      message: `Generated thumbnails for ${processed} images, ${failed} failed`,
      processed,
      failed,
      total: imagesWithoutThumbnails.length,
    });
  } catch (error) {
    console.error('[Thumbnails] Error:', error);
    res.status(500).json({ error: 'Failed to generate thumbnails' });
  }
});

// =====================================================
// CONTACT FORM API
// =====================================================

app.post('/api/contact', async (req, res) => {
  const { name, niche, contact, comment, budget } = req.body;

  // Log the request to the console (visible in Render logs)
  console.log('--- NEW CONTACT FORM SUBMISSION ---');
  console.log('Name:', name);
  console.log('Niche:', niche);
  console.log('Contact:', contact);
  console.log('Budget:', budget);
  console.log('Comment:', comment);
  console.log('Timestamp:', new Date().toISOString());
  console.log('-----------------------------------');

  // Send to Telegram
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (BOT_TOKEN && CHAT_ID) {
    try {
      const message = `
<b>🔔 Новая заявка с сайта</b>

<b>Имя:</b> ${name || 'Не указано'}
<b>Контакт:</b> ${contact || 'Не указан'}
<b>Бюджет:</b> ${budget && budget.trim() ? budget : 'Не выбран'}
<b>Ниша:</b> ${niche && niche.trim() ? niche : 'Не указана'}
<b>Комментарий:</b> ${comment && comment.trim() ? comment : 'Нет'}
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
