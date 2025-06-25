import { transformRecord } from '../services/transformer';
import { describe, expect, it } from '@jest/globals';

describe('transformRecord', () => {
  it('transforms SourceOrderData to TargetOrderModel correctly', () => {
    const source = {
      orderId: 'ORD-12345',
      orderDate: '10/15/2023',
      customerId: 'CUST-789',
      storeId: 42,
      items: [
        { sku: 'PROD-001', quantity: 2, unitPrice: 29.99, discountAmount: 5.00 }
      ],
      paymentMethod: 'CREDIT_CARD',
      totalAmount: 104.98,
      status: 'NEW',
      notes: 'Please deliver after 5 PM',
      shippingAddress: {
        street: '123 Main St',
        city: 'Columbus',
        state: 'OH',
        zipCode: '43215',
        country: 'USA'
      }
    };

    const result = transformRecord(source);

    expect(result.order.id).toBe('ORD-12345');
    expect(result.order.createdAt).toBe('2023-10-15');
    expect(result.order.customer.id).toBe('CUST-789');
    expect(result.order.location.storeId).toBe('42');
    expect(result.order.status).toBe('NEW');
    expect(result.order.payment.method).toBe('CREDIT_CARD');
    expect(result.order.payment.total).toBe(104.98);
    expect(result.order.shipping.address.line1).toBe('123 Main St');
    expect(result.items[0].productId).toBe('PROD-001');
    expect(result.items[0].price.discount).toBe(5);
    expect(result.metadata.notes).toBe('Please deliver after 5 PM');
    expect(result.metadata.source).toBe('order_producer');
    expect(typeof result.metadata.processedAt).toBe('string');
  });

  it('handles missing optional fields', () => {
    const source = {
      orderId: 'ORD-12345',
      orderDate: '10/15/2023',
      customerId: 'CUST-789',
      storeId: 42,
      items: [
        { sku: 'PROD-001', quantity: 2, unitPrice: 29.99 }
      ],
      paymentMethod: 'CREDIT_CARD',
      totalAmount: 104.98,
      status: 'NEW'
    };

    const result = transformRecord(source);

    expect(result.order.shipping.address.line1).toBe('');
    expect(result.metadata.notes).toBe('');
  });
});