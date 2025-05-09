
const db = {
    "tree-001": {
        especie: "Pinus elliottii",
        fecha: "2025-05-01",
        origen: "Lote 12, Campo Ramón",
        certificado: "FSC - Certificación Forestal"
    }
};

function showInfo(data) {
    const info = db[data];
    const result = document.getElementById("result");
    if (info) {
        result.innerHTML = `
            <h2>Árbol ID: ${data}</h2>
            <p><strong>Especie:</strong> ${info.especie}</p>
            <p><strong>Fecha de tala:</strong> ${info.fecha}</p>
            <p><strong>Origen:</strong> ${info.origen}</p>
            <p><strong>Certificación:</strong> ${info.certificado}</p>
        `;
    } else {
        result.innerHTML = "<p style='color: red;'><strong>Información no encontrada.</strong></p>";
    }
}

const html5QrCode = new Html5Qrcode("reader");
const config = { fps: 10, qrbox: 250 };

html5QrCode.start(
    { facingMode: "environment" },
    config,
    (decodedText, decodedResult) => {
        html5QrCode.stop();
        showInfo(decodedText);
    },
    (errorMessage) => {}
).catch(err => console.error(err));
