require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { ConnectDB } = require("./database/database");

const app = express();
const PORT = process.env.PORT || 8000;

// Database config (adjust as needed for your Docker setup)
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "docker_practice"
};

let db;

// Initialize DB and create table if not exists
async function initDB() {
    db = await mysql.createConnection(dbConfig);
    await db.execute(`
        CREATE TABLE IF NOT EXISTS messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log("Database connected and messages table ensured.");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    // Fetch all messages
    const [rows] = await db.execute("SELECT * FROM messages ORDER BY created_at DESC");
    const messagesHtml = rows.map(msg => `<li>${msg.content} <small>(${msg.created_at})</small></li>`).join('');
    res.send(`
        <html>
            <body>
                <h2>Welcome to Docker Project with Two Tier Node.js Application</h2>
                <form method="POST" action="/add-message">
                    <input type="text" name="content" placeholder="Enter your message" required />
                    <button type="submit">Add Message</button>
                </form>
                <h3>Messages:</h3>
                <ul>${messagesHtml}</ul>
            </body>
        </html>
    `);
});

app.post('/add-message', async (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).send("Message content is required.");
    }
    await db.execute("INSERT INTO messages (content) VALUES (?)", [content]);
    res.redirect('/');
});

app.get('/health', (req, res) => {
    res.status(200).send("Server is up and running");
});

app.listen(PORT, async () => {
    await initDB();
    await ConnectDB();
    console.log(`Server is Running on PORT ${PORT}`);
});