const axios = require('axios');

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, BASE_ID, BASE_URL, TABLE_NAME } = process.env;
  
  try {
    const response = await axios.get(`${BASE_URL}/${BASE_ID}/${TABLE_NAME}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: 'Une erreur est survenue lors de la récupération des données' })
    };
  }
};