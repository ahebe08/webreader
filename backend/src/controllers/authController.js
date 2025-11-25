const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Tentative d\'inscription pour:', email);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    console.log('Recherche utilisateur existant:', existingUser);

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Un utilisateur avec cet email existe déjà.' 
      });
    }

    // Hasher le mot de passe
    console.log('Hachage du mot de passe...');
    const passwordHash = await hashPassword(password);
    console.log('Mot de passe haché avec succès');

    // Créer l'utilisateur DIRECTEMENT avec Sequelize
    console.log('Création de l\'utilisateur...');
    const user = await User.create({
      email: email,
      password_hash: passwordHash
    });
    console.log('Utilisateur créé:', user.toJSON());

    // Générer le token
    console.log('Génération du token...');
    const token = generateToken(user.id);
    console.log('Token généré');

    res.status(201).json({
      success: true,
      message: 'Utilisateur inscrit avec succès',
      data: {
        utilisateur: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur d\'inscription DÉTAILLÉE:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de l\'inscription.' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Email ou mot de passe incorrect.' 
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Email ou mot de passe incorrect.' 
      });
    }

    // Mettre à jour la dernière connexion
    await User.updateLastLogin(user.id);

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        utilisateur: {
          id: user.id,
          email: user.email,
          lastLogin: user.last_login
        },
        token
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la connexion.' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Utilisateur non trouvé.' 
      });
    }

    res.json({
      success: true,
      data: {
        utilisateur: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      }
    });
  } catch (error) {
    console.error('Erreur de profil:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur.' 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { email } = req.body;

    const updatedUser = await User.updateProfile(req.userId, { email });

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        utilisateur: updatedUser
      }
    });
  } catch (error) {
    console.error('Erreur de mise à jour du profil:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur interne du serveur lors de la mise à jour du profil.' 
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};