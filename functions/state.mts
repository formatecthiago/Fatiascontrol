import { Handler } from '@netlify/functions';

const tableStates = [];

const handler: Handler = async (event, context) => {
    const { method } = event;

    switch (method) {
        case 'GET':
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(tableStates),
            };
        case 'POST':
            const newState = JSON.parse(event.body);
            tableStates.push(newState);
            return {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newState),
            };
        default:
            return {
                statusCode: 405,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'Method Not Allowed' }),
            };
    };
};

export { handler };