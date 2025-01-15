import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, customerName } = req.body;

    try {
      const paymentResponse = await axios.post('https://api.mayar.id/hl/v1/payment/create', {
        amount,
        customerName,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (paymentResponse.data.status === 'SUCCESS') {
        res.status(200).json({ success: true, data: paymentResponse.data });
      } else {
        res.status(400).json({ success: false, error: 'Payment creation failed' });
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}