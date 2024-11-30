const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');

const appPort = process.env.PORT || 3000;
const app = express();
app.use(cors());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sushmitha_final_project'
};

const database = mysql.createConnection(dbConfig);

const jwtSecretKey = 'Sushmitha';

const jwtAuthMiddleware = jwtMiddleware({
    secret: jwtSecretKey,
    algorithms: ['HS256']
});

app.use(express.json());

// Root API Endpoint
app.get('/', async (req, res) => {
    res.status(200).json({ success: true, message: 'API is running smoothly.' });
});

// Generate a cryptographic salt
function createSalt() {
    return crypto.randomBytes(32).toString('hex');
}

// Hash and salt the password
function hashPassword(password, salt) {
    const sha256Hasher = crypto.createHash('sha256');
    sha256Hasher.update(password + salt);
    return sha256Hasher.digest('hex');
}

// API for user signup
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, password, username, email } = req.body;
    const userSalt = createSalt();
    const hashedPassword = hashPassword(password, userSalt);

    database.query(
        'INSERT INTO user (password, salt, username, email) VALUES (?, ?, ?, ?)',
        [hashedPassword, userSalt, username, email],
        (dbError, dbResults) => {
            if (dbError) {
                console.error(dbError);
                res.status(500).json({ success: false, error: dbError.sqlMessage });
            } else {
                res.json({ status: 200, success: true, response: dbResults });
            }
        }
    );
});

// API for user login
app.post('/api/login', async (req, res) => {
    const { password, username } = req.body;

    database.query('SELECT * FROM user WHERE username = ?', [username], (dbError, dbResults) => {
        if (dbError) {
            console.error(dbError);
            res.status(500).json({ success: false, message: 'Database error occurred while fetching user.' });
        } else {
            if (dbResults.length > 0) {
                const foundUser = dbResults[0];
                const hashedPassword = hashPassword(password, foundUser.salt);

                if (hashedPassword === foundUser.password) {
                    const authToken = jwt.sign(
                        { username: foundUser.username, userId: foundUser.id },
                        jwtSecretKey,
                        { expiresIn: '59m' }
                    );

                    res.json({
                        success: true,
                        message: 'Login successful.',
                        user: {
                            username: foundUser.username,
                            userId: foundUser.id
                        },
                        token: authToken
                    });
                } else {
                    res.status(401).json({ success: false, message: 'Incorrect password.' });
                }
            } else {
                res.status(404).json({ success: false, message: 'User not found.' });
            }
        }
    });
});

app.get('/api/patentFilings', jwtAuthMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Assuming you have user authentication

    database.query(
        'SELECT country, patent_count FROM patent_filings', 
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get patent count data' });
            } else {
                res.json(results);
            }
        }
    );
});

app.get('/api/greenHydrogenInvestment', jwtAuthMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Assuming you have user authentication

    database.query(
        'SELECT country, investment_amount FROM green_hydrogen_investment ', 
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get investment data' });
            } else {
                res.json(results);
            }
        }
    );
});

// Connect to the database
database.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Successfully connected to the database.');
});

// Gracefully close the database connection
const closeDatabaseConnection = () => {
    database.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
};

// Start the server
const server = app.listen(appPort, () => {
    console.log(`Server running on port ${appPort}`);
});

// Handle server and database closure on process exit
process.on('exit', () => {
    server.close();
    closeDatabaseConnection();
    console.log('Server and database connection closed.');
});

module.exports = app;