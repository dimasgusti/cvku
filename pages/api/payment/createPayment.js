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

      console.log('Payment creation response:', paymentResponse.data);

      // Check if payment creation was successful based on Mayar's response structure
      if (paymentResponse.data.statusCode === 200 && paymentResponse.data.messages === 'success') {
        const transactionId = paymentResponse.data.data.transaction_id;
        const paymentLink = paymentResponse.data.data.link;

        console.log('Payment link:', paymentLink);

        setTimeout(async () => {
          try {
            const statusResponse = await axios.get(`https://api.mayar.id/hl/v1/payment/status/${transactionId}`, {
              headers: {
                'Authorization': `Bearer ${process.env.MAYAR_API_KEY}`,
              },
            });

            console.log('Payment status:', statusResponse.data);

            if (statusResponse.data.status === 'SUCCESS') {
              res.status(200).json({ success: true, transactionId, paymentLink });
            } else {
              res.status(400).json({ success: false, error: 'Payment not completed yet' });
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
            res.status(500).json({ success: false, error: 'Error checking payment status' });
          }
        }, 30000);

      } else {
        console.error('Payment creation failed:', paymentResponse.data.messages);
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