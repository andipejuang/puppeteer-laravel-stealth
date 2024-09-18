import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { fileURLToPath } from 'url';

// Tambahkan plugin stealth ke puppeteer-extra
puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'http://live4.thapcam24.net'; // URL target

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true, // Menjalankan dalam mode headless (latar belakang)
            args: [
                '--ignore-certificate-errors',
                '--disable-web-security',
                '--allow-running-insecure-content',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--remote-debugging-port=0',
               // '--window-size=1,1', // Membuat jendela sangat kecil sehingga hampir tidak terlihat
               // '--window-position=-100,0',
            ],
            ignoreHTTPSErrors: true,
        });

        // Gunakan halaman yang sudah ada daripada membuat halaman baru
        const pages = await browser.pages(); // Mendapatkan semua halaman yang ada
        const page = pages[0]; // Gunakan halaman pertama yang terbuka secara default

        // Set User-Agent agar sesuai dengan pengguna nyata
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        // Set beberapa headers tambahan untuk mensimulasikan pengguna manusia
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        // Set timezone untuk menghindari deteksi bot
        await page.emulateTimezone('America/New_York');

        // Set viewport ke ukuran yang diinginkan (1200x750)
        await page.setViewport({ width: 1200, height: 750 });

        // Navigasi ke halaman target
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 100000 });

        // Hapus atau sembunyikan elemen popup login, background putih, dan elemen yang diminta
        await page.evaluate(() => {
            // Hapus popup login
            const popup = document.querySelector('[data-testid="royal_login_form"]');
            if (popup) {
                popup.style.display = 'none';
            }

            // Hapus background putih atau overlay
            const overlay = document.querySelector('div[style*="background-color: rgba(255, 255, 255"]');
            if (overlay) {
                overlay.style.display = 'none';
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }

            // Hapus elemen dengan role dialog (seperti modal login)
            const dialog = document.querySelectorAll('div[role="dialog"]');
            dialog.forEach((d) => {
                d.style.display = 'none';
                d.style.opacity = '0';
                d.style.visibility = 'hidden';
            });

            // Hapus background overlay abu-abu
            const backgroundOverlay = document.querySelector('div[style*="background-color: rgba(0, 0, 0, 0.5)"]');
            if (backgroundOverlay) {
                backgroundOverlay.style.display = 'none';
                backgroundOverlay.style.opacity = '0';
                backgroundOverlay.style.visibility = 'hidden';
            }

            // Sembunyikan elemen berdasarkan class "__fb-light-mode x1n2onr6 xzkaem6"
            const fbLightModeElement = document.querySelector('.__fb-light-mode.x1n2onr6.xzkaem6');
            if (fbLightModeElement) {
                fbLightModeElement.style.display = 'none';
            }

            // Atur ulang elemen page agar tampil jelas
            const mainContent = document.querySelector('body');
            if (mainContent) {
                mainContent.style.opacity = '1';
                mainContent.style.visibility = 'visible';
                mainContent.style.pointerEvents = 'all'; // Aktifkan interaksi pengguna jika dibatasi
            }

            // Tambahan: Sembunyikan popup login lainnya
            const loginPopup = document.querySelector('#login_form');
            if (loginPopup) {
                loginPopup.style.display = 'none'; // Sembunyikan popup login
            }

            // Tambahan: Sembunyikan overlay dialog yang mungkin menghalangi halaman
            const overlayDialog = document.querySelector('div[role="dialog"]');
            if (overlayDialog) {
                overlayDialog.style.display = 'none'; // Sembunyikan overlay
            }

            // Tambahan: Hilangkan blur dari elemen tertentu
            const blurredElements = document.querySelectorAll('*');
            blurredElements.forEach((el) => {
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
        });

        // Ambil screenshot setelah popup dihapus
        const timestamp = Date.now();
        const screenshotPath = path.resolve(__dirname, `../public/ss/screenshot-${timestamp}.png`);
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot taken and saved at ${screenshotPath}`);

        await browser.close();
    } catch (error) {
        console.error('Error during Puppeteer execution:', error);
        // Jika error, segera hentikan proses dengan kode keluar 1 (menunjukkan error)
        process.exit(1);
    }
})();
