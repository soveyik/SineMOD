/**
 * Frontend Derleme Betiği (build-frontend.js)
 * 
 * Bu betik, 'frontend/ts' klasöründeki TypeScript dosyalarını tarayıcının anlayacağı JavaScript'e (public/js) dönüştürür
 * ve 'frontend/css' klasöründeki Tailwind CSS dosyalarını 'public/css' klasörüne derler.
 * 
 * Bu yapı, React kullanmadan modern bir geliştirme deneyimi sağlar.
 */

const esbuild = require('esbuild');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Argüman kontrolü (izleme modu için)
const isWatch = process.argv.includes('--watch');

/**
 * TypeScript Dosyalarını Derle
 */
async function buildTS() {
    try {
        const tsDir = path.join(__dirname, '../frontend/ts');
        const files = fs.readdirSync(tsDir).filter(file => file.endsWith('.ts'));
        
        const entryPoints = files.map(file => path.join(tsDir, file));

        const context = await esbuild.context({
            entryPoints: entryPoints,
            bundle: true,
            outdir: path.join(__dirname, '../public/js'),
            platform: 'browser',
            format: 'esm', // Modern tarayıcı modülleri için ESM formatı
            minify: !isWatch,
            sourcemap: isWatch,
        });

        if (isWatch) {
            await context.watch();
            console.log('👀 TypeScript dosyaları izleniyor...');
        } else {
            await context.rebuild();
            await context.dispose();
            console.log('✅ TypeScript derlemesi tamamlandı.');
        }
    } catch (err) {
        console.error('❌ TypeScript derleme hatası:', err);
    }
}

/**
 * Tailwind CSS Dosyalarını Derle
 */
function buildCSS() {
    const input = path.join(__dirname, '../frontend/css/main.css');
    const output = path.join(__dirname, '../public/css/style.css');
    
    // Tailwind CLI komutu
    const cmd = `npx tailwindcss -i "${input}" -o "${output}" ${isWatch ? '--watch' : '--minify'}`;
    
    const tailwindProcess = exec(cmd);
    
    tailwindProcess.stdout.on('data', (data) => console.log(`Tailwind: ${data}`));
    tailwindProcess.stderr.on('data', (data) => console.error(`Tailwind Hatası: ${data}`));
    
    if (!isWatch) {
        tailwindProcess.on('exit', () => console.log('✅ CSS derlemesi tamamlandı.'));
    } else {
        console.log('👀 CSS dosyaları izleniyor...');
    }
}

// Derleme işlemlerini başlat
console.log('🚀 Derleme süreci başlatılıyor...');
buildTS();
buildCSS();
