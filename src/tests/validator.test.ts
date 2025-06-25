import { isValidRecord } from '../utils/validator';
import { describe, expect, it } from '@jest/globals';

describe('isValidRecord', () => {
  it('returns valid for correct data', () => {
    const data = {
      orderId: 'ORD1',
      orderDate: '06/20/2025',
      customerId: 'CUST1',
      storeId: 1,
      items: [
        { sku: 'SKU1', quantity: 2, unitPrice: 10 }
      ],
      paymentMethod: 'CARD',
      totalAmount: 20,
      status: 'NEW'
    };
    expect(isValidRecord(data).valid).toBe(true);
  });

  it('returns invalid for missing required fields', () => {
    const data = {
      orderDate: '06/20/2025',
      customerId: 'CUST1',
      storeId: 1,
      items: [],
      paymentMethod: 'CARD',
      totalAmount: 20,
      status: 'NEW'
    };
    const result = isValidRecord(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing or invalid orderId');
    expect(result.errors).toContain('Missing or empty items array');
  });

  it('returns invalid for bad date and status', () => {
    const data = {
      orderId: 'ORD1',
      orderDate: '2025-06-20',
      customerId: 'CUST1',
      storeId: 1,
      items: [
        { sku: 'SKU1', quantity: 2, unitPrice: 10 }
      ],
      paymentMethod: 'CARD',
      totalAmount: 20,
      status: 'INVALID'
    };
    const result = isValidRecord(data);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid or missing orderDate (MM/DD/YYYY)');
    expect(result.errors?.some(e => e.includes('Invalid or missing status'))).toBe(true);
  });

  it('returns invalid for bad shipping address', () => {
    const data = {
      orderId: 'ORD1',
      orderDate: '06/20/2025',
      customerId: 'CUST1',
      storeId: 1,
      items: [
        { sku: 'SKU1', quantity: 2, unitPrice: 10 }
      ],
      paymentMethod: 'CARD',
      totalAmount: 20,
      status: 'NEW',
      shippingAddress: {
        street: 123,
        city: 456,
        state: 789,
        zipCode: 'abc',
        country: 123
      }
    };
    const result = isValidRecord(data);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('shippingAddress'))).toBe(true);
  });
});