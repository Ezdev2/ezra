exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            airtableApiKey: process.env.AIRTABLE_API_KEY,
            baseId: process.env.BASE_ID,
            baseUrl: process.env.BASE_URL,
            tableName: process.env.TABLE_NAME
        })
    };
    return response;
};