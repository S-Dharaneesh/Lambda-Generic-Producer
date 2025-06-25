import { APIGatewayProxyHandler } from 'aws-lambda';
import { publishToWebsite } from "./services/publisher";
import { transformRecord } from "./services/transformer";
import { AppError, handleError } from "./utils/errorHandler";
import { isValidRecord } from "./utils/validator";
import { Context } from 'aws-lambda';

export const LambdaHandler: APIGatewayProxyHandler = async (event, context: Context) => {
    const path = event.path || '';

    console.info('Incoming request', {
        path,
        method: event.httpMethod,
        requestId: context.awsRequestId,
        body: event.body ? '[REDACTED]' : undefined
    });

    if (path.endsWith('/healthCheck')) {
        console.info('Health check endpoint hit');
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
        };
    }

    else if (path.endsWith('/v1')) {
        try {
            const body = JSON.parse(event.body || '{}')

            const validation = isValidRecord(body);
            if (!validation.valid) {
                console.warn('Validation failed', { errors: validation.errors });
                throw new AppError('Invalid record format', 400, 'ValidationError');
            }

            const transformed = transformRecord(body);
            console.info('Record transformed successfully', { orderId: transformed.order.id });

            const result = await publishToWebsite(transformed);
            console.info('Record published successfully', { status: result });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Success', result })
            }
        }
        catch (error) {
            console.error('Error processing request', { 
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return handleError(error as Error | AppError);
        }
    }

    else {
        console.warn('Invalid path accessed', { path });
        return {
            statusCode: 404,
            body: JSON.stringify({error: true, message: 'Invalid path. Endpoint not found.', path})
        };
    }
}
