// Initialize QR Code Styling Instance
const qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    data: "https://example.com",
    margin: 10,
    qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H"
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5
    },
    dotsOptions: {
        type: "dots",
        color: "#ffffff"
    },
    backgroundOptions: {
        color: "#000000"
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#ffffff"
    },
    cornersDotOptions: {
        type: "dot",
        color: "#ffffff"
    }
});

// DOM Elements
const qrDataInput = document.getElementById('qr-data');
const colorDarkInput = document.getElementById('color-dark');
const colorLightInput = document.getElementById('color-light');
const colorDarkVal = document.getElementById('color-dark-val');
const colorLightVal = document.getElementById('color-light-val');
const dotStyleSelect = document.getElementById('dot-style');
const cornerStyleSelect = document.getElementById('corner-style');
const btnDownload = document.getElementById('btn-download');
const btnShare = document.getElementById('btn-share');
const qrCanvas = document.getElementById('qr-canvas');

// Initial Render
qrCode.append(qrCanvas);

// Helper function to debounce input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update QR Code
function updateQR() {
    const data = qrDataInput.value.trim() || "https://example.com";
    const darkColor = colorDarkInput.value;
    const lightColor = colorLightInput.value;
    const dotStyle = dotStyleSelect.value;
    const cornerStyle = cornerStyleSelect.value;

    qrCode.update({
        data: data,
        dotsOptions: {
            type: dotStyle,
            color: darkColor
        },
        backgroundOptions: {
            color: lightColor
        },
        cornersSquareOptions: {
            type: cornerStyle,
            color: darkColor
        },
        cornersDotOptions: {
            type: cornerStyle === 'square' ? 'square' : 'dot',
            color: darkColor
        }
    });
}

// Event Listeners for inputs
qrDataInput.addEventListener('input', debounce(updateQR, 300));

colorDarkInput.addEventListener('input', (e) => {
    colorDarkVal.textContent = e.target.value;
    updateQR();
});

colorLightInput.addEventListener('input', (e) => {
    colorLightVal.textContent = e.target.value;
    updateQR();
});

dotStyleSelect.addEventListener('change', updateQR);
cornerStyleSelect.addEventListener('change', updateQR);

// Download Action
btnDownload.addEventListener('click', () => {
    const data = qrDataInput.value.trim();
    if (!data) {
        alert('Please enter some data to generate a QR code.');
        return;
    }
    qrCode.download({
        name: "ProQR-Code",
        extension: "png"
    });
});

// Share Action
btnShare.addEventListener('click', async () => {
    const data = qrDataInput.value.trim();
    if (!data) {
        alert('Please enter some data first.');
        return;
    }

    if (!navigator.share) {
        alert('Web Share API is not supported in your browser.');
        return;
    }

    try {
        // Get raw blob from canvas/svg
        const blob = await qrCode.getRawData("png");
        if (!blob) throw new Error("Could not generate image blob");

        const file = new File([blob], "ProQR-Code.png", { type: "image/png" });
        
        await navigator.share({
            title: "ProQR Code",
            text: "Check out my QR Code generated with ProQR!",
            files: [file]
        });
    } catch (err) {
        console.error("Error sharing:", err);
        // Fallback or user canceled
    }
});

// Animate input placeholders for a nice touch
const placeholders = [
    "https://your-website.com",
    "WiFi Network details",
    "Contact information (VCard)",
    "Crypto wallet address",
    "Your social media profile"
];
let phIndex = 0;
setInterval(() => {
    if(document.activeElement !== qrDataInput && !qrDataInput.value) {
        phIndex = (phIndex + 1) % placeholders.length;
        qrDataInput.setAttribute("placeholder", placeholders[phIndex]);
    }
}, 3000);
