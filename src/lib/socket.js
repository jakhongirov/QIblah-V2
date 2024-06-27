const socketIO = require('socket.io');
const { fetch } = require('./postgres');

let io;

function initializeSocket(server) {
   const io = socketIO(server, {
      cors: {
         origin: "*",
         methods: ["GET", "POST"]
      }
   });

   io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('incrementZikrCount', async (zikr_id) => {
         const incrementZikrCountQuery = `
            UPDATE public_zikr
            SET zikr_current_count = zikr_current_count + 1
            WHERE zikr_id = $1
            RETURNING *;
         `;

         try {
            const updatedCount = await fetch(incrementZikrCountQuery, zikr_id);

            if (updatedCount?.zikr_count == updatedCount?.zikr_current_count) {
               const updateFinishingQuery = `
                  UPDATE public_zikr
                  SET zikr_finishing = true
                  WHERE zikr_id = $1
                  RETURNING *;
               `;

               await fetch(updateFinishingQuery, zikr_id);
            }

            const foundZikrQuery = `
            SELECT
               *
            FROM
               public_zikr
            WHERE
               zikr_id = $1
         `
            const foundZikr = await fetch(foundZikrQuery, zikr_id)

            // Emit a response to the client
            socket.emit('zikrCountUpdated', foundZikr);

         } catch (error) {
            console.error('Error updating zikr count:', error);
            // If there's an error, emit an error event to the client
            socket.emit('zikrCountUpdateError', { error: 'Error updating zikr count' });
         }
      });

      socket.on('error', (error) => {
         console.error('Socket.IO error:', error);
         // Additional error handling if needed
      });
   });

   return io;
}

function getIO() {
   if (!io) {
      throw new Error('Socket.io not initialized!');
   }
   return io;
}

module.exports = {
   initializeSocket,
   getIO,
};
