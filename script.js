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

// Helper function to show toasts for mobile/app users
function showToast(message) {
    let toast = document.getElementById('qr-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'qr-toast';
        document.body.appendChild(toast);
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(99, 102, 241, 0.95)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: '9999',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '14px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
        });
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 4000);
}

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

    // Render as an image to support native App/Webview long-press
    qrCode.getRawData("png").then(blob => {
        if(blob) {
            const url = URL.createObjectURL(blob);
            qrCanvas.innerHTML = `<img src="${url}" alt="QR Code" style="width: 100%; height: auto; display: block; border-radius: 14px; pointer-events: auto;">`;
        }
    }).catch(err => console.error(err));
}

// Initial Render
updateQR();

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

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        showToast("📱 App user: Long-Press the QR code above to Save image.");
        return; // Prevent AppsGeyser from throwing 'permission not granted'
    }

    try {
        qrCode.download({
            name: "ProQR-Code",
            extension: "png"
        });
    } catch(e) {
        console.error("Download failed", e);
    }
});

// Share Action
btnShare.addEventListener('click', async () => {
    const data = qrDataInput.value.trim();
    if (!data) {
        alert('Please enter some data first.');
        return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!navigator.share) {
        showToast("📱 Share API not supported in app. Please Long-Press the QR code to Share.");
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
        // If user didn't just cancel, show hint
        if (isMobile && err.name !== 'AbortError') {
            showToast("📱 Tip: You can also Long-Press the QR code to Share.");
        }
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
