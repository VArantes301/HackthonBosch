const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async ({ name, email, password }) => {
    const userExists = await userModel.findByEmail(email);
    if (userExists) {
        throw new Error('EMAIL_EXISTS');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create(name, email, passwordHash);
    return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await userModel.findByEmail(email);

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.password_hash) {
        throw new Error("SOCIAL_ACCOUNT");
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};


const googleLogin = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload(); 
    const { sub: googleId, email, name } = payload;

    let user = await userModel.findByGoogle(googleId);

    if (!user) {
        const existingEmailUser = await userModel.findByEmail(email);

        if (existingEmailUser) {
            user = await userModel.linkGoogleAccount(existingEmailUser.id, googleId);
        } else {
            user = await userModel.createGoogleUser(name, email, googleId);
        }
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin
};