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

exports.handler = async (event) => {
    const airtableApiKey = process.env.AIRTABLE_API_KEY; // Don't return this to the client
    const baseId = process.env.BASE_ID;
    const baseUrl = process.env.BASE_URL;
    const tableName = process.env.TABLE_NAME;

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            baseId,
            baseUrl,
            tableName
        })
    };
    return response;
};