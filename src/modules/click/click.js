const model = require('./model')
const iconv = require('iconv-lite');
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.BOT_TOKEN_PAYMENT, { polling: true });

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
            const options = {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit',
               second: '2-digit',
               timeZone: 'Asia/Tashkent'
            };
            const formatter = new Intl.DateTimeFormat('en-GB', options);
            const formattedDate2 = formatter.format(today);

            // Replace the format to match the required "DD.MM.YYYY HH:MM:SS" format
            const [day, month, year] = formattedDate2.split(', ')[0].split('/');
            const time = formattedDate2.split(', ')[1];
            const finalFormat = `${day}.${month}.${year} ${time}`;

            const formattedDate = expiresDate.toISOString();

            tracking['tarif'] = rate?.category_name
            tracking['amount'] = rate?.amount
            tracking['date'] = finalFormat
            tracking['expire_date'] = formattedDate
            tracking['type'] = "click"

            const foundUser = await model.foundUser(param2)
            await model.editUserPremium(foundUser?.user_token[Number(foundUser?.user_token?.length - 1)], formattedDate, "click", tracking)
            await model.addTransaction(click_trans_id, amount, monthToAdd, param2, merchant_trans_id, error, error_note, foundUser?.user_token[Number(foundUser?.user_token?.length - 1)])

            bot.sendMessage(634041736,
               `<strong>Click:</strong>\n\nUser token:${foundUser?.user_token[foundUser?.user_token?.length - 1]}\nTarif: ${foundPayment?.category_name}\nAmount: ${amount}\nDate: ${finalFormat}`,
               { parse_mode: "HTML" }
            );
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