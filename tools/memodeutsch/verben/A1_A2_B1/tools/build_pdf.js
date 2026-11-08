const fs = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('fs');
const path = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('path');
const os = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('os');
const { execSync } = requeéééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééééire('child_process');

const desktopPath = path.join(os.homedir(), 'Desktop');
const htmlPath = path.join(desktopPath, 'Tarjetas_A1_1.html');
const pdfPath = path.join(desktopPath, 'Primeras_6_Tarjetas_A1_1.pdf');

// Ensure the HTML was built correctly
if (!fs.existsSync(htmlPath)) {
    console.error('HTML file missing at:', htmlPath);
    process.exit(1);
}

// Windows absolute browser paths
const browsers = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = null;
for (const b of browsers) {
    if (fs.existsSync(b)) {
        browserPath = '"' + b + '"';
        break;
    }
}

if (!browserPath) {
    console.error('Could NOT find a supported browser (Edge or Chrome) to print the PDF.');
    process.exit(1);
}

console.log('Using browser at:', browserPath);

try {
    console.log('Generating PDF...');
    const command = browserPath + ' --headless --disable-gpu "--print-to-pdf=' + pdfPath + '" "' + htmlPath + '"';
    execSync(command, { stdio: 'inherit' });
    console.log('SUCCESS! PDF generated successfully at:', pdfPath);

    // Clean up temporary HTML
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
} catch (error) {
    console.error('Failed to convert PDF using Edge/Chrome.');
    console.error(error);
}
