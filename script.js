function generateQR() {
    let qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    let text = document.getElementById("text").value;

    if (text.trim() !== "") {
        new QRCode(qrDiv, {
            text: text,
            width: 100,
            height: 100
        });
}     else {
        alert("Please enter valid text!");
    
}


}
function downloadQR() {
    let qrCanvas = document.querySelector("#qrcode canvas");
    if (qrCanvas) {
        let img = qrCanvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = img;
        link.download = "qrcode.png";
        link.click();
    } else {
        alert("Generate a QR code first!");
    }
}

function shareQR() {
    let qrCanvas = document.querySelector("#qrcode canvas");
    if (navigator.share && qrCanvas) {
        qrCanvas.toBlob(blob => {
            let file = new File([blob], "qrcode.png", { type: "image/png" });
            navigator.share({
                files: [file],
                title: "QR Code",
                text: "Scan this QR code!"
            }).catch(console.error);
        });
    } else {
        alert("Sharing not supported or QR code not generated.");
    }
}
