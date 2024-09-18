import puppeteer from 'puppeteer-extra'; // Ganti puppeteer dengan puppeteer-extra
import StealthPlugin from 'puppeteer-extra-plugin-stealth'; // Import plugin stealth
import path from 'path';
import { fileURLToPath } from 'url';

// Tambahkan plugin stealth ke puppeteer-extra
puppeteer.use(StealthPlugin());

// Definisikan __dirname secara manual di modul ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = process.argv[2] || 'https://xnxx.com';

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--ignore-certificate-errors',  // Mengabaikan kesalahan sertifikat SSL
                '--disable-web-security',       // Menonaktifkan fitur keamanan web
                '--allow-running-insecure-content', // Mengizinkan konten tidak aman (HTTP)
                '--proxy-server=http://proxy_ip:proxy_port' // Ganti proxy_ip dan proxy_port dengan nilai yang benar
            ],
            ignoreHTTPSErrors: true, // Mengabaikan error HTTPS
        });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' }); // Tunggu hingga jaringan stabil

        const timestamp = Date.now();
        const screenshotPath = path.resolve(__dirname, `../public/ss/screenshot-${timestamp}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken and saved at ${screenshotPath}`);

        await browser.close();
    } catch (error) {
        console.error('Error during Puppeteer execution:', error);
    }
})();
