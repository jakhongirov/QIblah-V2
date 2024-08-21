const model = require('./model')
const iconv = require('iconv-lite');

module.exports = {
   Prepare: async (req, res) => {
      try {
         const { click_trans_id, amount, param2, param3, merchant_trans_id, error, error_note } = req.body
         let code = '';

         const makeCode = (length) => {
            let characters = '0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
               code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
         }

         if (error_note === 'Success') {
            let rate = {}
            let tracking = {}
            const foundPayment = await model.foundPayment(param3);

            if (foundPayment) {
               rate = foundPayment
            } else {
               const hexString = param3.replace(/%/g, '');
               const buffer = Buffer.from(hexString, 'hex');
               const decoded = iconv.decode(buffer, 'windows-1251');
               const foundPayment = await model.foundPayment(decoded);
               rate = foundPayment
            }

            const today = new Date();
            const expiresDate = new Date(today);
            const monthToAdd = Number(rate?.month);
            let targetMonth = today.getMonth() + monthToAdd;
            let targetYear = today.getFullYear();

            while (targetMonth > 11) {
               targetMonth -= 12;
               targetYear++;
            }

            expiresDate.setFullYear(targetYear, targetMonth, 1);
            const maxDaysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
            expiresDate.setDate(Math.min(today.getDate(), maxDaysInTargetMonth));

            if (expiresDate < today) {
               expiresDate.setMonth(expiresDate.getMonth() + 1);
               expiresDate.setDate(0); // Set to the last day of the previous month
            }
            const todayFormat = today.getDate().toString().padStart(2, '0') + '.' +
               (today.getMonth() + 1).toString().padStart(2, '0') + '.' +
               today.getFullYear() + ' ' +
               today.getHours().toString().padStart(2, '0') + ':' +
               today.getMinutes().toString().padStart(2, '0') + ':' +
               today.getSeconds().toString().padStart(2, '0');

            const formattedDate = expiresDate.toISOString();

            tracking['tarif'] = rate?.category_name
            tracking['amount'] = rate?.amount
            tracking['date'] = todayFormat
            tracking['expire_date'] = formattedDate
            tracking['type'] = "click"

            const foundUser = await model.foundUser(param2)
            await model.editUserPremium(foundUser?.user_token[Number(foundUser?.user_token?.length - 1)], formattedDate, "click", tracking)
            await model.addTransaction(click_trans_id, amount, monthToAdd, param2, merchant_trans_id, error, error_note, foundUser?.user_token[Number(foundUser?.user_token?.length - 1)])
         }

         makeCode(4)

         return res.status(200).json({
            merchant_prepare_id: code,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            error: error,
            error_note: error_note
         })

      } catch (error) {
         console.log(error)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   },

   Complete: async (req, res) => {
      try {
         const { click_trans_id, merchant_trans_id, error, error_note } = req.body

         return res.status(200).json({
            merchant_prepare_id: 5,
            merchant_trans_id: merchant_trans_id,
            click_trans_id: click_trans_id,
            merchant_confirm_id: null,
            error: error,
            error_note: error_note
         })
      } catch (error) {
         console.log(err)
         res.status(500).json({
            status: 500,
            message: "Internal Server Error",
         })
      }
   }
}