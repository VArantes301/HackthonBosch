const authService = require('../services/authService');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail and password are required' });
    }

    try {
        const newUser = await authService.registerUser({ name, email, password });
        return res.status(201).json({ message: 'User successfully registered!', user: newUser });
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') {
            return res.status(400).json({ error: 'This email is already in use' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail and password are required' });
    }

    try {
        const result = await authService.loginUser({ email, password });
        return res.status(200).json({ message: 'Login successful', ...result });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: 'E-mail or password incorrect' });
        }
        if (error.message === 'SOCIAL_ACCOUNT') {
            return res.status(400).json({ error: 'This account uses social login' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'idToken is required' });
    }

    try {
        const result = await authService.googleLogin(idToken);
       
        return res.status(200).json({ message: 'Google login successful', ...result });
    } catch (error) {
        console.error('Erro na validação do Google:', error.message);
        return res.status(401).json({ error: 'Invalid Google Token' });
    }
};

module.exports = { 
    register,
    login,
    googleLogin
};