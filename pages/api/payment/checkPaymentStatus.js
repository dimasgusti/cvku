import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'Transaction ID is required' });
    }

    try {
      const paymentStatusResponse = await axios.get(`https://api.mayar.id/hl/v1/payment/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      });

      if (paymentStatusResponse.data.statusCode === 200) {
        const status = paymentStatusResponse.data.data.status;

        return res.status(200).json({ success: true, status });
      } else {
        return res.status(400).json({ success: false, error: 'Payment not found or invalid status' });
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}