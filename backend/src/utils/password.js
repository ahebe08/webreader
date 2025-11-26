const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (password.length < minLength) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'Le mot de passe doit contenir des majuscules, minuscules et chiffres';
  }
  
  return null;
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};