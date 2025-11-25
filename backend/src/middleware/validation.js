const { validatePasswordStrength } = require('../utils/password');

const validateRegistration = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false,
      error: 'L\'email, le mot de passe et la confirmation sont requis.' 
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false,
      error: 'Les mots de passe ne correspondent pas.' 
    });
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return res.status(400).json({ 
      success: false,
      error: passwordError 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Format d\'email invalide.' 
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'L\'email et le mot de passe sont requis.' 
    });
  }

  next();
};

const validateBook = (req, res, next) => {
  const { title, author, year, page_count } = req.body;

  if (!title || !author) {
    return res.status(400).json({ 
      success: false,
      error: 'Le titre et l\'auteur sont requis.' 
    });
  }

  if (year && (year < 0 || year > new Date().getFullYear())) {
    return res.status(400).json({ 
      success: false,
      error: 'L\'année de publication est invalide.' 
    });
  }

  if (page_count && page_count <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Le nombre de pages doit être supérieur à 0.' 
    });
  }

  next();
};

const validateReadingProgress = (req, res, next) => {
  const { lastPage, progress } = req.body;

  if (lastPage === undefined && progress === undefined) {
    return res.status(400).json({ 
      success: false,
      error: 'Au moins une donnée (lastPage ou progress) doit être fournie.' 
    });
  }

  if (lastPage !== undefined && (lastPage < 1 || !Number.isInteger(lastPage))) {
    return res.status(400).json({ 
      success: false,
      error: 'Le numéro de page doit être un entier positif.' 
    });
  }

  if (progress !== undefined && (progress < 0 || progress > 100)) {
    return res.status(400).json({ 
      success: false,
      error: 'La progression doit être comprise entre 0 et 100.' 
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateBook,
  validateReadingProgress
};