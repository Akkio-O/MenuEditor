const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');
const menuRoutes = require('./src/router/menuRoutes');

const app = express();
const saltRounds = 10;
const secret = crypto.randomBytes(64).toString('hex');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

// use routers
app.use('/apiMenu', menuRoutes);

app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (rows.length === 0) {
            return res.status(401).send({error: 'Ошибка авторизации: пользователь не найден'});
        }
        const user = rows[0];
        // password === password_hash?
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
            req.session.authorized = true;
            req.session.username = username;
            req.session.role = 'user';
            return res.status(201).send({
                success: 'Успешная авторизация',
                role: user.role
            });
        } else {
            return res.status(401).send({error: 'Ошибка авторизации: неверный пароль'});
        }
    } catch (err) {
        console.error("ERROR", err);
        return res.status(500).send({error: 'Ошибка сервера'});
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

        if (rows.length > 0) {
            const error = {};
            const usernameExists = rows.some(user => user.username === username);
            const emailExists = rows.some(user => user.email === email);

            if (usernameExists) {
                error.username = 'Логин занят';
            }

            if (emailExists) {
                error.email = 'Email занят';
            }

            if (Object.keys(error).length > 0) {
                return res.status(409).send(error);
            }
        }

        // hash password
        const hash = await bcrypt.hash(password, saltRounds);
        const role = 'user';

        await db.query('INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)', [username, hash, email, role]);
        
        req.session.authorized = true;
        req.session.username = username;
        req.session.role = role;
        
        return res.status(201).send({success: 'Пользователь успешно зарегистрирован', role: role});
    } catch (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.send('Logged out successfully');
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
