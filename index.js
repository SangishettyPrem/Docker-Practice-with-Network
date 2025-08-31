require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ConnectDB } = require("./database/database");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.status(200).send("Welcome to Docker Project with Two Tier Node.js Application")
})

app.get('/health', (req, res) => {
    res.status(200).send("Serve is up and running");
})


app.listen(PORT, async () => {
    await ConnectDB();
    console.log("Server is Running on PORT");
})