// pages/api/paymentWebhook.ts

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Webhook handler function
const handleWebhook = (req: express.Request, res: express.Response) => {
  const { event, data } = req.body;

  // Validate the request data
  if (!event || !data) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const { 
    id, 
    status, 
    merchantName, 
    merchantEmail, 
    customerName, 
    customerEmail, 
    amount, 
    productName, 
    productType, 
    custom_field 
  } = data;

  // Log the data for debugging purposes
  console.log(`Received webhook event: ${event}`);
  console.log(`Transaction ID: ${id}`);
  console.log(`Status: ${status}`);
  console.log(`Merchant: ${merchantName} (${merchantEmail})`);
  console.log(`Customer: ${customerName} (${customerEmail})`);
  console.log(`Amount: ${amount}`);
  console.log(`Product: ${productName} (${productType})`);

  // Process custom fields if provided
  if (custom_field && custom_field.length > 0) {
    custom_field.forEach((field: { name: string, value: string }) => {
      console.log(`Custom field - ${field.name}: ${field.value}`);
    });
  }

  // Actions based on the payment status
  if (status === 'SUCCESS') {
    console.log('Payment successful, processing order...');
  } else if (status === 'FAILED') {
    console.log('Payment failed, please retry...');
  } else {
    console.log('Unknown payment status.');
  }

  // Respond back to the gateway
  return res.status(200).json({ message: 'Webhook received successfully' });
};

// Next.js API route handler
export default function handler(req: express.Request, res: express.Response) {
  if (req.method === 'POST') {
    handleWebhook(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}