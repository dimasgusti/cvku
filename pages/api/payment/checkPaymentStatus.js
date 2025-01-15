import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
      console.log(`Checking transaction status for email: ${email}`);

      const transactionsResponse = await axios.get('https://api.mayar.id/hl/v1/transactions', {
        params: {
          page: 1,
          pageSize: 10,
        },
        headers: {
          'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
        },
      });

      console.log('Transactions response:', transactionsResponse.data);

      const transaction = transactionsResponse.data.data.find(item => item.customer.email === email);

      if (transaction) {
        const status = transaction.status;

        return res.status(200).json({
          success: true,
          status: `Transaction status: ${status}`,
        });
      } else {
        return res.status(404).json({ success: false, error: 'Transaction not found for this email' });
      }
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}