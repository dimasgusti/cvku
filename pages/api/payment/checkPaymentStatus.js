import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'Transaction ID is required' });
    }

    try {
      const statusResponse = await axios.get(`https://api.mayar.id/hl/v1/payment/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      });

      console.log('Payment status response:', statusResponse.data);

      const { statusCode, messages, data } = statusResponse.data;

      if (statusCode === 200) {
        if (messages === 'active') {
          res.status(200).json({ success: true, status: 'Payment in progress' });
        } else if (messages === 'closed') {
          res.status(200).json({ success: true, status: 'Payment completed' });
        } else if (messages === 'unlisted') {
          res.status(400).json({ success: false, error: 'Payment no longer valid' });
        } else {
          res.status(400).json({ success: false, error: 'Unknown payment status' });
        }
      } else {
        res.status(404).json({ success: false, error: 'Payment not found' });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}