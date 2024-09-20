const express = require('express');
const path = require('path');
const axios = require('axios'); // Use axios for API requests
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve the main index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get blogs from Airtable
app.get('/api/blogs', async (req, res) => {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.BASE_ID;
    const endpoint = `${process.env.BASE_URL}/${baseId}/${process.env.TABLE_NAME}`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': `Bearer ${airtableApiKey}`
            }
        });
        res.json(response.data); // Send the data back to the frontend
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});