import { APIGatewayProxyHandler } from 'aws-lambda';
import { Context } from 'aws-lambda';
import { healthCheckHandler } from './routes/healthCheck';
import { orderHandler } from './routes/order';

export const LambdaHandler: APIGatewayProxyHandler = async (event, context: Context) => {
    const path = event.path || '';

    console.info('Incoming request', {
        path,
        method: event.httpMethod,
        requestId: context.awsRequestId,
        body: event.body ? '[REDACTED]' : undefined
    });

    if (path.endsWith('/healthCheck')) {
        if (event.httpMethod !== 'GET') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: true, message: 'Method Not Allowed. Use GET for healthCheck.' })
            };
        }
        console.info('Health check endpoint hit');
        return healthCheckHandler();
    }
    else if (path.endsWith('/v1')) {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: true, message: 'Method Not Allowed. Use POST for this endpoint.' })
            };
        }
        return orderHandler(event);
    }
    else {
        console.warn('Invalid path accessed', { path });
        return {
            statusCode: 404,
            body: JSON.stringify({error: true, message: 'Invalid path. Endpoint not found.', path})
        };
    }
}
