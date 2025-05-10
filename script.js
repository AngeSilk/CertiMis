// Base de datos local de árboles (simulada)
const treeDatabase = {
    "tree-001": {
        id: "tree-001",
        species: "Pino Elliotis (Pinus elliottii)",
        harvestDate: "15/04/2025",
        location: "San Pedro, Misiones (-26.6234, -54.1088)",
        certification: "FSC Certificado",
        certificationStatus: "active",
        additionalInfo: "Cosechado bajo pautas sostenibles. Plantación de 12 años.",
        imageUrl: "/api/placeholder/400/300",
        imageAlt: "Pino Elliotis"
    },
    "tree-002": {
        id: "tree-002",
        species: "Araucaria (Araucaria angustifolia)",
        harvestDate: "22/03/2025",
        location: "Eldorado, Misiones (-26.4088, -54.6232)",
        certification: "PEFC Certificado",
        certificationStatus: "active",
        additionalInfo: "Especie nativa bajo manejo forestal sostenible.",
        imageUrl: "/api/placeholder/400/300",
        imageAlt: "Araucaria angustifolia"
    },
    "tree-003": {
        id: "tree-003",
        species: "Eucalipto (Eucalyptus grandis)",
        harvestDate: "05/04/2025",
        location: "Posadas, Misiones (-27.3621, -55.9007)",
        certification: "En proceso de certificación",
        certificationStatus: "pending",
        additionalInfo: "Plantación gestionada con criterios FSC, certificación en trámite.",
        imageUrl: "/api/placeholder/400/300",
        imageAlt: "Eucalipto grandis"
    },
    "tree-004": {
        id: "tree-004",
        species: "Pino Taeda (Pinus taeda)",
        harvestDate: "30/03/2025",
        location: "Oberá, Misiones (-27.4828, -55.1202)",
        certification: "FSC Certificado",
        certificationStatus: "active",
        additionalInfo: "Plantación de 15 años. Madera destinada a exportación.",
        imageUrl: "/api/placeholder/400/300",
        imageAlt: "Pino Taeda"
    }
};

// Configuración del scanner QR
let html5QrcodeScanner = null;
let scannerActive = false;

// Elementos del DOM
const scannerContainer = document.getElementById('scanner-container');
const treeInfoCard = document.getElementById('tree-info');
const errorContainer = document.getElementById('error-container');
const scanAgainBtn = document.getElementById('scan-again-btn');
const tryAgainBtn = document.getElementById('try-again-btn');

// Inicializar la aplicación cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', () => {
    initQRScanner();
    setupEventListeners();
});

// Inicializar el escáner QR
function initQRScanner() {
    // Configuración del escáner
    const config = {
        fps: 10,
        qrbox: {
            width: 250,
            height: 250
        },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
    };

    // Crear instancia del escáner
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    
    // Iniciar la cámara con callbacks
    html5QrcodeScanner.start(
        { facingMode: "environment" }, // Usar cámara trasera
        config,
        onScanSuccess,
        onScanError
    ).then(() => {
        scannerActive = true;
        console.log("Escáner QR iniciado correctamente");
    }).catch(err => {
        console.error("Error al iniciar el escáner QR:", err);
        // Mostrar mensaje amigable al usuario
        const qrReader = document.getElementById('qr-reader');
        qrReader.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #F44336; margin-bottom: 1rem;">❌ Error al iniciar la cámara</p>
                <p>Por favor, asegúrese de que su dispositivo tiene una cámara y que ha concedido permisos para utilizarla.</p>
                <button id="retry-camera" class="button primary-button" style="margin-top: 1rem;">Reintentar</button>
            </div>
        `;
        document.getElementById('retry-camera').addEventListener('click', () => {
            location.reload();
        });
    });
}

// Función para manejar un escaneo exitoso
function onScanSuccess(qrCodeMessage) {
    // Detener el escáner cuando se detecta un código
    if (scannerActive) {
        stopScanner();
        
        // Procesar el código QR escaneado
        processQRCode(qrCodeMessage);
    }
}

// Función para manejar errores de escaneo
function onScanError(err) {
    // Solo registrar errores importantes, no los errores de "no QR code found"
    if (err !== "No QR code found") {
        console.error("Error de escaneo:", err);
    }
}

// Procesar el código QR escaneado
function processQRCode(qrCode) {
    // Comprobar si el código QR existe en la base de datos
    if (treeDatabase[qrCode]) {
        // Mostrar información del árbol
        displayTreeInfo(treeDatabase[qrCode]);
    } else {
        // Mostrar mensaje de error si el código no está registrado
        showErrorMessage();
    }
}

// Mostrar la información del árbol
function displayTreeInfo(treeData) {
    // Ocultar el escáner y el mensaje de error
    scannerContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    
    // Mostrar la tarjeta de información del árbol
    treeInfoCard.style.display = 'block';
    
    // Actualizar los datos en la interfaz
    document.getElementById('tree-id').textContent = treeData.id;
    document.getElementById('tree-species').textContent = treeData.species;
    document.getElementById('tree-date').textContent = treeData.harvestDate;
    document.getElementById('tree-location').textContent = treeData.location;
    document.getElementById('tree-certification').textContent = treeData.certification;
    
    // Mostrar información adicional si existe
    if (treeData.additionalInfo) {
        document.getElementById('tree-additional-info').textContent = treeData.additionalInfo;
        document.getElementById('tree-additional-info-container').style.display = 'flex';
    } else {
        document.getElementById('tree-additional-info-container').style.display = 'none';
    }
    
    // Actualizar la imagen del árbol
    if (treeData.imageUrl) {
        const treeImageElement = document.getElementById('tree-image');
        treeImageElement.src = treeData.imageUrl;
        treeImageElement.alt = treeData.imageAlt || treeData.species;
        document.getElementById('tree-image-container').style.display = 'block';
    } else {
        document.getElementById('tree-image-container').style.display = 'none';
    }
    
    // Configurar el badge de certificación
    const certBadge = document.getElementById('certification-badge');
    if (treeData.certificationStatus === 'active') {
        if (treeData.certification.includes('FSC')) {
            certBadge.style.backgroundColor = '#118c0b'; // Verde FSC
        } else if (treeData.certification.includes('PEFC')) {
            certBadge.style.backgroundColor = '#00529b'; // Azul PEFC
        }
    } else if (treeData.certificationStatus === 'pending') {
        certBadge.style.backgroundColor = '#FFA000'; // Amarillo para pendiente
    } else {
        certBadge.style.backgroundColor = '#9e9e9e'; // Gris para otros estados
    }
}

// Mostrar mensaje de error
function showErrorMessage() {
    // Ocultar el escáner y la información del árbol
    scannerContainer.style.display = 'none';
    treeInfoCard.style.display = 'none';
    
    // Mostrar el mensaje de error
    errorContainer.style.display = 'block';
}

// Detener el escáner QR
function stopScanner() {
    if (html5QrcodeScanner && scannerActive) {
        html5QrcodeScanner.stop().then(() => {
            scannerActive = false;
            console.log("Escáner QR detenido");
        }).catch(err => {
            console.error("Error al detener el escáner QR:", err);
        });
    }
}

// Reiniciar el escáner QR
function restartScanner() {
    // Ocultar la información del árbol y el mensaje de error
    treeInfoCard.style.display = 'none';
    errorContainer.style.display = 'none';
    
    // Mostrar el escáner
    scannerContainer.style.display = 'block';
    
    // Reiniciar la página para iniciar el escáner nuevamente
    location.reload();
}

// Configurar los event listeners
function setupEventListeners() {
    // Botón para escanear otro código
    scanAgainBtn.addEventListener('click', restartScanner);
    
    // Botón para intentar nuevamente después de un error
    tryAgainBtn.addEventListener('click', restartScanner);
}
