const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
        try {
                const { fullName,
                        userName,
                        password,
                        phoneNumber } = req.body;
                const userId = crypto.randomBytes(16).toString('hex');
                const serverClient = connect(api_key, api_secret, app_id);
                const hashedPassword = await bcrypt.hash(password, 10);
                const token = serverClient.createUserToken(userId);
                res.status(200).json({ token, fullName, userName, userId, hashedPassword, phoneNumber });
        }
        catch (error) {
                console.log('Error logging in:', error);
                res.status(500).json({ message: error })
        }
};

// const login = async (req, res) => {
//         try {
//                 const { userName, password } = req.body;
//                 const serverClient = connect(api_key, api_secret, app_id);
//                 const client = StreamChat.getInstance(api_key, api_secret);

//                 const { users } = await client.queryUsers({ name: userName });

//                 if (!users.length) return res.status(400).json({ message: 'User not found' });
//                 const success = await bcrypt.compare(password, users[0].hashedPassword);

//                 const token = serverClient.createUserToken(users[0].id);

//                 if (success) {
//                         res.status(200).json({ token, userId: users[0].id, fullName: users[0].fullName, userName });
//                 } else {
//                         res.status(500).json({ message: 'Invalid password' });
//                 }
//         }
//         catch (error) {
//                 console.log('Error logging in:', error);
//                 res.status(500).json({ message: error })
//         }
// };

const login = async (req, res) => {
        try {
                const { name, password } = req.body;
                const serverClient = connect(api_key, api_secret, app_id);
                const client = StreamChat.getInstance(api_key, api_secret);

                // Query users using the correct field (e.g., "userName")
                const { users } = await client.queryUsers({ name });

                // Check if user exists
                if (!users.length) {
                        return res.status(400).json({ message: 'User not found' });
                }

                const user = users[0];

                // Verify password using bcrypt
                const success = await bcrypt.compare(password, user.hashedPassword);

                // Generate token and respond
                if (success) {
                        const token = serverClient.createUserToken(user.id);
                        res.status(200).json({
                                token,
                                userId: user.id,
                                fullName: user.fullName,
                                userName: user.userName,
                        });
                } else {
                        res.status(400).json({ message: 'Invalid password' }); // Return 400 for invalid credentials
                }
        } catch (error) {
                console.error('Error logging in:', error.message);
                res.status(500).json({ message: 'Internal Server Error' });
        }
};

module.exports = { signup, login }