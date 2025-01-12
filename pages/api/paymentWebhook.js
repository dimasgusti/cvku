// paymentWebhook.js (Node.js built-in HTTP module)

const http = require('http');

// Fungsi untuk menangani data JSON yang diterima
const handleWebhook = (req, res) => {
  let data = '';

  // Mengumpulkan data yang datang dalam chunk
  req.on('data', chunk => {
    data += chunk;
  });

  // Setelah seluruh data diterima
  req.on('end', () => {
    try {
      const parsedData = JSON.parse(data); // Parse JSON payload

      const { event, data: transactionData } = parsedData;

      if (!event || !transactionData) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request data' }));
        return;
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
      } = transactionData;

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

      // Tindakan berdasarkan status pembayaran
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
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Webhook received successfully' }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error processing webhook', error: error.message }));
    }
  });
};

// Membuat server HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook/payment') {
    handleWebhook(req, res); // Menangani webhook pada route /webhook/payment
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

// Menjalankan server pada port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Webhook server listening at http://localhost:${PORT}`);
});