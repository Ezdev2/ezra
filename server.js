const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching test data:', error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

app.get('/config', (req, res) => {
    res.json({
        airtableApiKey: process.env.AIRTABLE_API_KEY,
        baseId: process.env.BASE_ID,
        baseUrl: process.env.BASE_URL,
        tableName: process.env.TABLE_NAME,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});