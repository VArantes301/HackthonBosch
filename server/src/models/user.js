const db = require('../config/db');

const findByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
}

const findByGoogle = async (googleId) => {
    const result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId])
    return result.rows[0] || null
}

const createGoogleUser = async (name, email, googleId) => {
    const query = `
        INSERT INTO users (name, email, google_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `

    const result = await db.query(query, [name, email, googleId]);
    return result.rows[0];
}

const create = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `
    const result = await db.query(query, [name, email, passwordHash]);
    return result.rows[0]
}

const linkGoogleAccount = async (userId, googleId) => {
    const query = `
        UPDATE users
        SET google_id = $1
        WHERE id = $2
        RETURNING id, name, email
    `
    const result = await db.query(query, [googleId, userId])
    return result.rows[0]
}

const updatePassword = async (userId, passwordHash) => {
    const query = `
        UPDATE users
        SET password_hash = $1
        WHERE id = $2
        RETURNING id, name, email
    `;
    const result = await db.query(query, [passwordHash, userId]);
    return result.rows[0];
}

module.exports = {
    findByGoogle,
    findByEmail,
    create,
    createGoogleUser,
    linkGoogleAccount,
    updatePassword
}