const { Op, sequelize } = require('sequelize');
const {
    Conversation,
    Message,
    User,
    UserConversations,
} = require('../models/index.js');

exports.sendMessage = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id; // Pastikan ini diatur oleh middleware autentikasi

        // Temukan atau buat percakapan antara senderId dan receiverId
        let conversation = await Conversation.findOne({
            include: [
                {
                    model: User,
                    as: 'participants',
                    where: {
                        id: {
                            [Op.in]: [senderId, receiverId],
                        },
                    },
                },
            ],
            group: ['Conversation.id'],
            having: sequelize.literal('COUNT(participants.id) = 2'),
        });

        if (!conversation) {
            conversation = await Conversation.create({}, { transaction });
            await UserConversations.bulkCreate(
                [
                    { userId: senderId, conversationId: conversation.id },
                    { userId: receiverId, conversationId: conversation.id },
                ],
                { transaction }
            );
        }

        // Simpan pesan baru dalam percakapan
        const newMessage = await Message.create(
            {
                senderId,
                receiverId,
                message,
                conversationId: conversation.id,
            },
            { transaction }
        );

        // Perbarui lastMessage di percakapan
        await conversation.update({ lastMessage: message }, { transaction });

        // Commit transaksi
        await transaction.commit();

        // Kirim notifikasi ke sender dan receiver
        await sendNotification(senderId, receiverId);

        res.status(200).json({ message: newMessage });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.sendNotification = async (senderId, receiverId) => {
    try {
        const sender = await User.findByPk(senderId);
        if (sender) {
            sender.notifications.push({
                type: 'message',
                message: `You have a new message from user ${receiverId}`, // Customize notification message
            });
            await sender.save();
        }

        const recipient = await User.findByPk(receiverId);
        if (recipient) {
            recipient.notifications.push({
                type: 'message',
                message: `You have a new message from user ${senderId}`, // Customize notification message
            });
            await recipient.save();
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};
