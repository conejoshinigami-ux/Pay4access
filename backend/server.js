require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Base de datos simulada (solo para pruebas)
const users = []; // { email, passwordHash }

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// ====== ENDPOINT DE PRUEBA ======
app.get('/', (req, res) => {
    res.send("Servidor Pay4Access activo");
});

// ====== REGISTRO ======
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email y contraseña requeridos" });

    const existingUser = users.find(u => u.email === email);
    if (existingUser) return res.status(400).json({ error: "Usuario ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });
    res.json({ message: "Usuario registrado correctamente" });
});

// ====== LOGIN ======
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
