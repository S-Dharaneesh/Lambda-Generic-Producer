import { isValidRecord } from '../utils/validator';
import { AppError, handleError } from '../utils/errorHandler';
import { transformRecord } from '../services/transformer';
import { publishToWebsite } from '../services/publisher';

export const orderHandler = async (event: any) => {
    try {
        const body = JSON.parse(event.body || '{}')

        const validation = isValidRecord(body);
        if (!validation.valid) {
            console.warn('Validation failed', { errors: validation.errors });
            throw new AppError('Invalid record format', 400, 'ValidationError', true, validation.errors);
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
};