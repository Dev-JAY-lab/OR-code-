function generateQR() {
    let qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    let text = document.getElementById("text").value;

    if (text.trim() !== "") {
        new QRCode(qrDiv, {
            text: text,
            width: 180,
            height: 180
        });
}     else {
        alert("Please enter valid text!");
    
}


}
