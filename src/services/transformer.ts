import { SourceOrderData } from '../models/sourceModel';
import { TargetOrderModel } from '../models/targetModel';


export const transformRecord = (sourceData: SourceOrderData): TargetOrderModel => {

    const formatDate = (dateStr: string): string => {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const transformedItems = sourceData.items.map(item => ({
        productId: item.sku,
        quantity: item.quantity,
        price: {
            base: item.unitPrice,
            discount: item.discountAmount || 0,
            final: item.unitPrice - (item.discountAmount || 0)
        }
    }));

    const defaultShipping = {
        line1: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    };

    const transformedRecord: TargetOrderModel = {
        order: {
            id: sourceData.orderId,
            createdAt: formatDate(sourceData.orderDate),
            customer: {
                id: sourceData.customerId
            },
            location: {
                storeId: sourceData.storeId.toString()
            },
            status: sourceData.status.toUpperCase(),
            payment: {
                method: sourceData.paymentMethod,
                total: sourceData.totalAmount
            },
            shipping: {
                address: sourceData.shippingAddress ? {
                    line1: sourceData.shippingAddress.street,
                    city: sourceData.shippingAddress.city,
                    state: sourceData.shippingAddress.state,
                    postalCode: sourceData.shippingAddress.zipCode,
                    country: sourceData.shippingAddress.country
                } : defaultShipping
            }
        },
        items: transformedItems,
        metadata: {
            source: 'order_producer',
            notes: sourceData.notes || '',
            processedAt: new Date().toISOString()
        }
    };

    return transformedRecord;
};