// paymentWebhook.js (Node.js with Express example)

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Endpoint untuk menerima webhook dari Mayar
app.post('/webhook/payment', (req, res) => {
  const { event, data } = req.body;

  // Validasi data yang diterima
  if (!event || !data) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const { 
    id, 
    status, 
    merchantId, 
    merchantName, 
    merchantEmail, 
    customerName, 
    customerEmail, 
    customerMobile, 
    amount, 
    productId, 
    productName, 
    productType, 
    custom_field 
  } = data;

  // Menangani webhook berdasarkan event
  console.log(`Received webhook event: ${event}`);
  console.log(`Transaction ID: ${id}`);
  console.log(`Status: ${status}`);
  console.log(`Merchant: ${merchantName} (${merchantEmail})`);
  console.log(`Customer: ${customerName} (${customerEmail})`);
  console.log(`Amount: ${amount}`);
  console.log(`Product: ${productName} (${productType})`);

  // Proses custom_field jika ada
  if (custom_field && custom_field.length > 0) {
    custom_field.forEach(field => {
      console.log(`Custom field - ${field.name}: ${field.value}`);
    });
  }

  // Lakukan tindakan berdasarkan status pembayaran
  if (status === 'SUCCESS') {
    // Tindakan jika pembayaran berhasil
    console.log('Payment successful, processing order...');
  } else if (status === 'FAILED') {
    // Tindakan jika pembayaran gagal
    console.log('Payment failed, please retry...');
  } else {
    // Tindakan jika status tidak dikenali
    console.log('Unknown payment status.');
  }

  // Kirim respon sukses ke gateway
  return res.status(200).json({ message: 'Webhook received successfully' });
});

app.listen(port, () => {
  console.log(`Webhook server listening at http://localhost:${port}`);
});