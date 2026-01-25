
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
    console.error('Error: dist/index.html not found. Run build first.');
    process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Find the CSS file in assets
const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));

if (cssFile) {
    const cssPath = path.join(assetsDir, cssFile);
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    console.log(`Inlining CSS: ${cssFile} (${(cssContent.length / 1024).toFixed(2)} KB)`);

    // Replace the link tag with style tag
    // Vite generates: <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
    // We look for the filename in the link tag

    const linkTagRegex = new RegExp(`<link[^>]*href=["']\/assets\/${cssFile}["'][^>]*>`, 'i');

    if (linkTagRegex.test(html)) {
        html = html.replace(linkTagRegex, `<style>${cssContent}</style>`);
        fs.writeFileSync(indexPath, html);
        console.log('Successfully inlined CSS into index.html');
    } else {
        console.warn('Warning: CSS link tag not found in index.html (maybe already inlined?)');
    }

} else {
    console.error('Error: No CSS file found in dist/assets');
    process.exit(1);
}
