import axios from 'axios';

export default async function handler(req, res) {
  const { transactionId } = req.query;

  const API_URL = 'https://api.mayar.id/hl/v1/payment/status';
  const MAYAR_API_KEY = process.env.MAYAR_API_KEY;

  console.log('Checking payment status for transaction:', transactionId);  // Log the transaction ID

  try {
    const response = await axios.get(API_URL, {
      params: { transactionId },
      headers: {
        Authorization: `Bearer ${MAYAR_API_KEY}`,
      }
    });

    console.log('Mayar response:', response.data);  // Log the response from Mayar
    return res.status(200).json(response.data);  // Send the response back to the client
  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ error: 'Error checking payment status' });  // Return an error if the request fails
  }
}