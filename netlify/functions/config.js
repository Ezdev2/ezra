exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
            BASE_ID: process.env.BASE_ID,
            BASE_URL: process.env.BASE_URL,
            TABLE_NAME: process.env.TABLE_NAME,
        }),
    };
};
