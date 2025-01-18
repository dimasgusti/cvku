export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const webhookToken = process.env.MAYAR_WEBHOOK_TOKEN;
            const signature = req.headers['x-mayar-signature'];

            if (signature !== webhookToken) {
                return res.status(400).json({ message: 'Invalid signature' });
            }

            const eventData = req.body; 
            console.log(eventData);
            
            return res.status(200).json({ message: 'Success' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}