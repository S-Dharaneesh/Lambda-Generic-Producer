export const healthCheckHandler = async () => ({
    statusCode: 200,
    body: JSON.stringify({
        status: 'ok',
        message: 'Producer Lambda is running and healthy.',
        timestamp: new Date().toISOString()
    })
});