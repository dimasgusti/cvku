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
      
      console.log('Payment status response:', statusResponse.data);
      
      if (statusResponse.data.status) {
        if (statusResponse.data.status === 'active') {
          res.status(200).json({ success: true, status: 'Payment is active' });
        } else if (statusResponse.data.status === 'closed') {
          res.status(200).json({ success: true, status: 'Payment is completed' });
        } else if (statusResponse.data.status === 'unlisted') {
          res.status(200).json({ success: true, status: 'Payment is unlisted' });
        } else {
          console.error('Unknown status from Mayar:', statusResponse.data.status);
          res.status(400).json({ success: false, error: 'Unknown payment status from Mayar API' });
        }
      } else {
        res.status(400).json({ success: false, error: 'Payment status not found in response' });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}