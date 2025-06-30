import { APIGatewayProxyHandler } from 'aws-lambda';
import { Context } from 'aws-lambda';
import { healthCheckHandler } from './routes/healthCheck';
import { orderHandler } from './routes/order';
import { AppError, handleError } from './utils/errorHandler';

export const LambdaHandler: APIGatewayProxyHandler = async (event, context: Context) => {
    try {
        const path = event.path || '';
        console.info('Incoming request', {
            path,
            method: event.httpMethod,
            requestId: context.awsRequestId,
            body: event.body ? '[REDACTED]' : undefined
        });

        if (path.endsWith('/healthCheck')) {
            if (event.httpMethod !== 'GET') {
                console.log('Health check endpoint hit');
                throw new AppError('Method Not Allowed. Use GET for healthCheck.', 405, 'MethodNotAllowed', true, [event.httpMethod]);
            }
            console.info('Health check endpoint hit');
            return healthCheckHandler();
        }
        else if (path.endsWith('/v1')) {
            if (event.httpMethod !== 'POST') {
                throw new AppError('Method Not Allowed. Use POST for this endpoint.', 405, 'MethodNotAllowed', true, [event.httpMethod]);
            }
            return orderHandler(event);
        }
        else {
            console.warn('Invalid path accessed', { path });
            throw new AppError('Invalid path. Endpoint not found.', 404, 'NotFound', true, [path]);
        }
    }
    catch (error) {
        return handleError(error as Error);
    }
}

