require('dotenv').config();
const model = require('./model')
const axios = require('axios');

const instance = axios.create({
   baseURL: process.env.PAYME_BASE_URL,
   headers: {
      'Content-Type': 'application/json',
      'X-Auth': `Basic ${Buffer.from(`${process.env.MERCHANT_ID}:${process.env.API_KEY}`).toString('base64')}`
   }
});

const createPayment = async (amount, account) => {
   try {
      const response = await instance.post('/', {
         method: 'cards.create',
         params: {
            amount: amount,
            account: account
         }
      });
      return response.data;
   } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
   }
};

module.exports = {
   PAYMENT: async (req, res) => {
      try {
         const { method, params } = req.body;
         console.log(req.body)

         return res.json({
            jsonrpc: "2.0",
            result: {
               status: 200
            },
            id: req.body.id
         });

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   },

   CREATE: async (req, res) => {
      try {
         const { amount, account } = req.body;
         console.log(req.body)

         const payment = await createPayment(amount, account);
         res.json(payment);

      } catch (error) {
         console.log(error);
         res.status(500).json({
            status: 500,
            message: "Interval Server Error"
         })
      }
   }
}