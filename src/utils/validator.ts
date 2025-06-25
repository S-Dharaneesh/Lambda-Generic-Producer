const validStatuses = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
const zipRegex = /^\d{5}(?:-\d{4})?$/;

export const isValidRecord = (data: any): { valid: boolean; errors?: string[] } => {
  const errors: string[] = [];

  if (typeof data.orderId !== 'string') errors.push('Missing or invalid orderId');
  if (typeof data.orderDate !== 'string' || !dateRegex.test(data.orderDate))
    errors.push('Invalid or missing orderDate (MM/DD/YYYY)');
  if (typeof data.customerId !== 'string') errors.push('Missing or invalid customerId');
  if (typeof data.storeId !== 'number') errors.push('Missing or invalid storeId');

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Missing or empty items array');
  } else {
    data.items.forEach((item: any, index: number) => {
      if (typeof item.sku !== 'string') errors.push(`Item[${index}]: Missing or invalid sku`);
      if (typeof item.quantity !== 'number' || item.quantity <= 0)
        errors.push(`Item[${index}]: Invalid quantity`);
      if (typeof item.unitPrice !== 'number' || item.unitPrice < 0)
        errors.push(`Item[${index}]: Invalid unitPrice`);
      if (item.discountAmount !== undefined && typeof item.discountAmount !== 'number')
        errors.push(`Item[${index}]: Invalid discountAmount`);
    });
  }

  if (typeof data.paymentMethod !== 'string') errors.push('Missing or invalid paymentMethod');

  if (data.shippingAddress) {
    const addr = data.shippingAddress;
    if (typeof addr !== 'object') {
      errors.push('shippingAddress must be an object');
    } else {
      if (typeof addr.street !== 'string') errors.push('shippingAddress: Missing or invalid street');
      if (typeof addr.city !== 'string') errors.push('shippingAddress: Missing or invalid city');
      if (typeof addr.state !== 'string') errors.push('shippingAddress: Missing or invalid state');
      if (typeof addr.zipCode !== 'string' || !zipRegex.test(addr.zipCode))
        errors.push('shippingAddress: Invalid or missing zipCode');
      if (typeof addr.country !== 'string') errors.push('shippingAddress: Missing or invalid country');
    }
  }

  if (typeof data.totalAmount !== 'number' || data.totalAmount < 0)
    errors.push('Missing or invalid totalAmount');

  if (typeof data.status !== 'string' || !validStatuses.includes(data.status))
    errors.push(`Invalid or missing status (expected: ${validStatuses.join(', ')})`);

  return {
    valid: errors.length === 0,
    errors: errors.length ? errors : undefined,
  };
};

