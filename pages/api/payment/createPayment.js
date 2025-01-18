import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, customerName, email, mobile, description } = req.body;

    try {
      const paymentResponse = await axios.post('https://api.mayar.id/hl/v1/payment/create', {
        amount,
        customerName,
        email,
        mobile,
        description,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (paymentResponse.data.statusCode === 200 && paymentResponse.data.messages === 'success') {
        const { statusCode, messages, data } = paymentResponse.data;
        const { id, transaction_id, link } = data;

        res.status(200).json({
          success: true,
          statusCode,
          messages,
          data: {
            id,
            transaction_id,
            link,
          },
        });

      } else {
        console.error('Payment creation failed:', paymentResponse.data.messages);
        res.status(400).json({ success: false, error: 'Payment creation failed', details: paymentResponse.data });
      }
    } catch (error) {
      console.error('Error creating payment:', error.response ? error.response.data : error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}