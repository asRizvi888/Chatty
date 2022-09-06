/* eslint-disable indent */
/* eslint-disable quotes */

const functions = require('firebase-functions');
const StreamChat = require('stream-chat').StreamChat;

const STREAM_API_KEY = 'c3qsgbdua78r';
// eslint-disable-next-line max-len
const STREAM_SECRET = '7hqtn3pqnwt4am8kvtkd63zr5p3brdjn8mv5mea2fn8gzsdsj7pmfsyjz3ge8ffb';

const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_SECRET);

exports.onCreateUser = functions.firestore
  .document('Users/{userId}')
  .onCreate((snapshot, context) => {
    const userId = snapshot.data().userId;
    const token = serverClient.createToken(userId);
    // eslint-disable-next-line object-curly-spacing
    return snapshot.ref.set({ token }, { merge: true });
  });
