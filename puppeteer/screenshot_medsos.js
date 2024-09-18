import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'; // Plugin untuk bypass CAPTCHA
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Tambahkan plugin stealth ke puppeteer-extra
puppeteer.use(StealthPlugin());

// Tambahkan plugin recaptcha untuk bypass CAPTCHA
puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: '10572d68906a44bcbc61909554eef9e9', // Ganti dengan API key 2Captcha Anda
        },
        visualFeedback: true, // Menampilkan feedback proses solving CAPTCHA di terminal
    })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://www.tiktok.com/@frizz.ml_/video/7412622839787818246'; // URL target

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--ignore-certificate-errors',
                '--disable-web-security',
                '--allow-running-insecure-content',
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        // Navigasi ke halaman target
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        // Bypass CAPTCHA jika muncul selama verifikasi
        const { captchas, solved, error } = await page.solveRecaptchas();

        if (captchas.length > 0) {
            console.log(`Found and solved ${solved.length} CAPTCHA(s)`);
        } else {
            console.log('No CAPTCHAs found on this page.');
        }

        // Setelah CAPTCHA di-bypass, lanjutkan evaluasi halaman
        await page.evaluate(() => {
            // Sembunyikan popup login jika ada
            const loginPopup = document.querySelector('#login_form');
            if (loginPopup) {
                loginPopup.style.display = 'none'; // Sembunyikan popup login
            }

            // Sembunyikan overlay dialog yang mungkin menghalangi halaman
            const overlay = document.querySelector('div[role="dialog"]');
            if (overlay) {
                overlay.style.display = 'none'; // Sembunyikan overlay
            }

            // Hilangkan blur dari elemen tertentu
            const blurredElements = document.querySelectorAll('*');
            blurredElements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);

                // Menghapus filter blur jika ada
                if (computedStyle.filter.includes('blur')) {
                    el.style.filter = 'none'; // Hilangkan blur
                }

                // Menghapus properti opacity jika kurang dari 1 (menyebabkan blur putih)
                if (computedStyle.opacity < 1) {
                    el.style.opacity = '1'; // Atur opacity ke 1 untuk menghilangkan efek blur putih
                }

                // Menghapus backdrop-filter jika ada
                if (computedStyle.backdropFilter) {
                    el.style.backdropFilter = 'none'; // Hilangkan efek blur backdrop
                }
            });

            // Jika ada elemen dengan "overflow" atau "hidden", nonaktifkan itu
            document.body.style.overflow = 'auto'; // Pastikan halaman bisa discroll dengan bebas
        });

        // Ambil screenshot setelah popup login dan blur dihilangkan
        const timestamp = Date.now();
        const screenshotPath = path.resolve(__dirname, `../public/ss/screenshot-${timestamp}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken and saved at ${screenshotPath}`);

        await browser.close();
    } catch (error) {
        console.error('Error during Puppeteer execution:', error);
    }
})();
