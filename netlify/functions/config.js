// exports.handler = async (event) => {
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify({
//             airtableApiKey: process.env.AIRTABLE_API_KEY,
//             baseId: process.env.BASE_ID,
//             baseUrl: process.env.BASE_URL,
//             tableName: process.env.TABLE_NAME
//         })
//     };
//     return response;
// };

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