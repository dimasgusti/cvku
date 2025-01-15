import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({ success: false, error: 'Transaction ID is required' });
    }

    try {
      console.log(`Checking payment status for transaction: ${transactionId}`);

      const statusResponse = await axios.get(`https://api.mayar.id/hl/v1/payment/status/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      });

      console.log('Mayar response:', statusResponse.data);

      const status = statusResponse.data.status;
      if (status === 'active') {
        return res.status(200).json({ success: true, status: 'Payment in progress' });
      } else if (status === 'closed') {
        return res.status(200).json({ success: true, status: 'Payment completed' });
      } else if (status === 'unlisted') {
        return res.status(200).json({ success: false, error: 'Payment no longer valid' });
      } else {
        console.log(`Unexpected status: ${status}`);
        return res.status(500).json({ success: false, error: 'Unknown payment status from Mayar API' });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}