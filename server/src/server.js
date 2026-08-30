const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./config/db');

const authRoutes = require('./routes/authRoutes')
const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'API rodando e conectada!' })
})

app.use((err, req, res, next) => {
    console.error('Erro interno do servidor:', err.stack);
    res.status(500).json({ message: 'Erro interno no servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Acessível na rede local em http://192.168.1.15:${PORT}`);
})