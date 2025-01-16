import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
      console.log(`Fetching all transactions for email: ${email}`);

      let page = 1;
      let allTransactions = [];
      let moreTransactions = true;

      while (moreTransactions) {
        const transactionsResponse = await axios.get('https://api.mayar.id/hl/v1/transactions', {
          params: {
            page: page,
            pageSize: 10, 
          },
          headers: {
            'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
          },
        });

        console.log(`Transactions response for page ${page}:`, transactionsResponse.data);

        const filteredTransactions = transactionsResponse.data.data.filter(item => item.customer.email === email);

        allTransactions = [...allTransactions, ...filteredTransactions];

        if (transactionsResponse.data.data.length < 10) {
          moreTransactions = false;
        } else {
          page++; 
        }
      }

      const simplifiedTransactions = allTransactions.map(transaction => ({
        email: transaction.customer.email,
        mobile: transaction.customer.mobile,
        id: transaction.id,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        membership: transaction.paymentLink.name,
        credit: transaction.credit,
        created: new Date(transaction.createdAt).toLocaleString(),
      }));

      if (simplifiedTransactions.length > 0) {
        return res.status(200).json({
          success: true,
          transactions: simplifiedTransactions,
        });
      } else {
        return res.status(404).json({ success: false, error: 'No transactions found for this email' });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}