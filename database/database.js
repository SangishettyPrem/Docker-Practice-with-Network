const mysql = require("mysql2");

const ConnectDB = async () => {
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        connection.connect(err => {
            if (err) {
                console.error("Error while Connecting Database: ", err);
                process.exit(1);
            }
            console.log("Connected to Database");
            return connection;
        })
    } catch (error) {
        console.error("Error while Connecting Database: ", error);
        process.exit(1);
    }
}

module.exports = {
    ConnectDB
}