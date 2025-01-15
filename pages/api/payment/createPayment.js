import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, customerName } = req.body;

    console.log('Received data:', { amount, customerName });

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

      console.log('Payment response:', paymentResponse.data);

      if (paymentResponse.data.status === 'SUCCESS') {
        res.status(200).json({ success: true, data: paymentResponse.data });
      } else {
        res.status(400).json({ success: false, error: 'Payment creation failed' });
      }
    } catch (error) {
      console.error('Error creating payment:', error);

      if (error.response) {
        console.error('Error response from Mayar API:', error.response.data);
        res.status(400).json({ success: false, error: error.response.data.message || 'Unknown error' });
      } else {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}