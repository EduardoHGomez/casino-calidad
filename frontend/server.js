const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware'); 
const axios = require('axios');
const cors = require('cors');

const morgan = require('morgan'); // Optional: For better logging

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://34.202.136.132:3000',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// BACKEND
const BACKEND_URL = 'http://10.0.140.169:3000';

// app.use(morgan('combined')); // Optional: Use morgan for detailed logs
// app.use((req, res, next) => {
//     console.log(`Frontend received request: ${req.method} ${req.url}`);
//     next();
// });

// Middleware to parse JSON bodies
app.use(express.json());

// app.use('/api', createProxyMiddleware({
//     target: BACKEND_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         '^/api': '', // Remove '/api' prefix
//     },
//     logLevel: 'debug', // Enable detailed logging
//     onProxyReq: (proxyReq, req, res) => {
//         console.log(`Proxying request to: ${BACKEND_URL}${req.url}`);
//     },
//     onProxyRes: (proxyRes, req, res) => {
//         console.log(`Received response from backend: ${proxyRes.statusCode}`);
//     },
//     onError: (err, req, res) => {
//         console.error('Proxy error:', err);
//         res.status(500).send('Proxy encountered an error.');
//     },
// }));

// STATIC Files Frontend - After Proxy Middleware
app.use(express.static(path.join(__dirname, 'public')));
const viewsPath = path.join(__dirname, 'public/views');

// --------- Directions --------------------

// Serve HTML pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(viewsPath, 'logIn.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(viewsPath, 'register.html'));
});
app.get('/activity', (req, res) => {
    res.sendFile(path.join(viewsPath, 'activity.html'));
});
app.get('/profile', (req, res) => {
    res.sendFile(path.join(viewsPath, 'profile.html'));
});
app.get('/index_logIn', (req, res) => {
    res.sendFile(path.join(viewsPath, 'index_logIn.html'));
});
app.get('/info', (req, res) => {
    res.sendFile(path.join(viewsPath, 'info.html'));
});
app.get('/balance', (req, res) => {
    res.sendFile(path.join(viewsPath, 'balance.html'));
});
app.get('/roulette', (req, res) => {
    res.sendFile(path.join(viewsPath, 'roulette.html'));
});
app.get('/hi-lo', (req, res) => {
    res.sendFile(path.join(viewsPath, 'hi-lo.html'));
});
app.get('/mines', (req, res) => {
    res.sendFile(path.join(viewsPath, 'mineBet.html'));
});

// Any other route
// 1. Register Route
app.post('/api/register', async (req, res) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/register`, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Backend sends JSON: { message: 'Usuario registrado con éxito.' }
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in /api/register:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/login`, req.body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Backend sends a token string, e.g., "user_id_12345"
        // Wrap it in a JSON object for frontend consistency
        res.status(response.status).json({ token: response.data });
    } catch (error) {
        console.error('Error in /api/login:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 3. Get User Name Route
app.get('/api/getUserName', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.get(`${BACKEND_URL}/getUserName`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            params: req.query, // Forward any query parameters
        });
        // Backend sends JSON: { name: 'User Name' }
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in /api/getUserName:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 4. Update Profile Route
app.put('/api/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.put(`${BACKEND_URL}/profile`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });
        // Backend sends updated user object
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in PUT /api/profile/:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 4.5 Profile api route 
app.get('/api/profile', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader;
        const response = await axios.get(`${BACKEND_URL}/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            params: req.query, // Forward query parameters
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in GET /api/profile/:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});


// 5. Get Profile Balance Route
app.get('/api/profile/balance', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.get(`${BACKEND_URL}/profile/balance`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            params: req.query, // Forward any query parameters
        });
        // Backend sends JSON: { balance: 1000 }
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in GET /api/profile/balance:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 6. Update Profile Balance Route
app.put('/api/profile/balance', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.put(`${BACKEND_URL}/profile/balance`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });
        // Backend sends updated balance: { balance: 1500 }
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in PUT /api/profile/balance:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 7. Get Activity Route
app.get('/api/profile/activity', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.get(`${BACKEND_URL}/profile/activity`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            params: req.query, // Forward any query parameters
        });
        // Backend sends a list of activities
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in GET /api/activity:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});

// 8. Post Activity Route
app.post('/api/profile/activity', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader;
        const response = await axios.post(`${BACKEND_URL}/profile/activity`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token, // Assuming activity creation requires auth
            },
        });
        // Backend sends the saved activity data
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error in POST /api/activity:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Manual Proxy encountered an error.' });
    }
});



// Catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'index_logInPending.html'));
});

// Start the frontend server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend is being served at http://localhost:${PORT}`);
});
