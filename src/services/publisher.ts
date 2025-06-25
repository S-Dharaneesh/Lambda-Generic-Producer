import { AppError } from "../utils/errorHandler";
import { TargetOrderModel } from "../models/targetModel";

export const publishToWebsite = async (record: TargetOrderModel): Promise<string> => {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('Webhook URL is not configured');
        throw new AppError(
            'Webhook URL is not configured', 500, 'WEBHOOK_URL_UNDEFINED'
        );
    }

    try {
        console.info('Publishing to webhook', { orderId: record.order.id });
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Webhook responded with error', { status: response.status, errorText });
            throw new AppError(
                `Webhook responded with status ${response.status}`, response.status, 'WEBHOOK_RESPONSE_ERROR', true
            );
        }
        console.info('Webhook publish successful', { status: response.status, orderId: record.order.id });
        return response.statusText;
    } 
    catch (err: any) {
        console.error('Failed to publish to webhook', { error: err?.message, orderId: record.order.id });
        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(
            'Failed to publish to webhook', 502, err?.message || 'UNKNOWN_PUBLISH_ERROR'
        );
    }
}