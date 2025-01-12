// pages/api/paymentWebhook.ts

import { NextApiRequest, NextApiResponse } from 'next';

const handleWebhook = (req: NextApiRequest, res: NextApiResponse) => {
  const { event, data } = req.body;

  if (!event || !data) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const {
    id,
    status,
    merchantName,
    customerName,
    amount,
    productName,
    productType,
    custom_field
  } = data;

  // Log details for debugging
  console.log(`Received event: ${event}`);
  console.log(`Transaction ID: ${id}`);
  console.log(`Status: ${status}`);
  console.log(`Merchant: ${merchantName}`);
  console.log(`Customer: ${customerName}`);
  console.log(`Amount: ${amount}`);
  console.log(`Product: ${productName} (${productType})`);

  if (status === 'SUCCESS') {
    // Process successful payment, e.g., update order status or send email
    console.log('Payment successful, processing...');
  } else if (status === 'FAILED') {
    // Handle payment failure
    console.log('Payment failed, retry...');
  }

  // If custom fields exist, process them
  if (custom_field && custom_field.length > 0) {
    custom_field.forEach((field:any) => {
      console.log(`Custom field - ${field.name}: ${field.value}`);
    });
  }

  // Send response back to payment gateway
  return res.status(200).json({ message: 'Webhook received successfully' });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    handleWebhook(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}