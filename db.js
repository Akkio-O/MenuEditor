const mysql2 = require('mysql2/promise');
require('dotenv').config();

const con = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function createTables() {
    try {
        await con.query(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                parent_id INT DEFAULT NULL,
                is_active TINYINT DEFAULT FALSE,
                FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE
            )
        `);
        console.log('menu_items table created');

        await con.query(`
            CREATE TABLE IF NOT EXISTS submenu_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                subname VARCHAR(255) NOT NULL,
                menu_item_id INT,
                FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
            )
        `);
        console.log('submenu_items table created');

        await con.query(`
            CREATE TABLE IF NOT EXISTS subsubmenu_items (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                child_id INT,
                menu_items_id INT,
                FOREIGN KEY (child_id) REFERENCES submenu_items(id) ON DELETE CASCADE,
                FOREIGN KEY (menu_items_id) REFERENCES menu_items(id) ON DELETE CASCADE
            )
        `);
        console.log('subsubmenu_items table created');

        await con.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                role VARCHAR(20),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('users table created');

    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
}


createTables();

const promisePool = con;

module.exports = promisePool;
