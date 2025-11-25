const multer = require('multer');
const path = require('path');
const fs = require('fs');

// S'assurer que les répertoires d'upload existent
const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../../../uploads'),
    path.join(__dirname, '../../../uploads/covers'),
    path.join(__dirname, '../../../uploads/pdfs')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Configuration du stockage pour les images de couverture
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirs();
    cb(null, path.join(__dirname, '../../../uploads/covers'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, 'couverture-' + uniqueSuffix + path.extname(safeName));
  }
});

// Configuration du stockage pour les fichiers PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirs();
    cb(null, path.join(__dirname, '../../../uploads/pdfs'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, 'livre-' + uniqueSuffix + path.extname(safeName));
  }
});

// Filtre de validation pour les images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls JPEG, PNG et WebP sont acceptés.'), false);
  }
};

// Filtre de validation pour les PDF
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls les PDF sont acceptés.'), false);
  }
};

// Configuration Multer pour les couvertures
const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Configuration Multer pour les PDF
const uploadPDF = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Middleware de gestion d'erreurs pour Multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'Fichier trop volumineux. Taille maximale autorisée: 5MB pour les images, 50MB pour les PDF.' 
      });
    }
  }
  next(error);
};

module.exports = {
  uploadCover,
  uploadPDF,
  handleUploadError,
  ensureUploadDirs
};