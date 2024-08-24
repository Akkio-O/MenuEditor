const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = process.env.PORT || 3000;

const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test'
});
con.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

con.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL, password_hash VARCHAR(255) NOT NULL, email VARCHAR(50) UNIQUE NOT NULL, role VARCHAR(20), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)', (err, res) => {
    if (err) {
        console.error('Error creating table:', err.message);
        return;
    }
    console.log('table created');
});

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

app.post('/login', (req, res) => {
    const { username, email, password } = req.body;

    con.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, result) => {
        if (err) {
            console.error("ERROR", err);
            return res.status(500).send({error: 'Ошибка сервера'});
        }
        if (result.length === 0) {
            return res.status(401).send({error: 'Ошибка авторизации: пользователь не найден'});
        }
        const user = result[0];
        // password ===  password_hash?
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                return res.status(500).send({error: 'Ошибка сравнения паролей'});
            }

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
        });
    });
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    con.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length > 0) {
            const error = {};
            const usernameExists = result.some(user => user.username === username);
            const emailExists = result.some(user => user.email === email);

            if (usernameExists) {
                error.username = 'Логин занят';
            }

            if (emailExists) {
                error.email = 'Email занят';
            }
            if (Object.keys(error).length > 0) {
                return res.status(409).send(error.username || error.email)
            }

        } else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).send('Internal Server Error');
                }
                const role = 'user';
                con.query('INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)', [username, hash, email, role], (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500);
                    } else {
                        req.session.authorized = true;
                        req.session.username = username;
                        req.session.role = 'user';
                        console.error('Success', result);
                        return res.status(201).send({success: 'Пользователь успешно зарегистрирован', role: user.role});
                    }
                });
            });
        }
    });
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out successfully');
});

app.listen(port, () => console.log(`server running on ${port}`));