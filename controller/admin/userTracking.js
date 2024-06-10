const User = require('../../model/user');

const onlineThreshold = 5 * 60 * 1000; // 5 dakika

// Kullanıcı aktivitesini güncelle
exports.updateUserActivity = async (sessionId) => {
    const now = new Date();
    await User.findOneAndUpdate(
        { sessionId },
        { lastActive: now, sessionId },
        { upsert: true, new: true }
    );
};

// Kullanıcı istatistiklerini al
exports.getUserStats = async () => {
    const now = new Date();
    const onlineUsers = await User.countDocuments({
        lastActive: { $gte: new Date(now - onlineThreshold) }
    });
    const totalVisitors = await User.countDocuments();
    console.log(totalVisitors)
    return { onlineUsers, totalVisitors };
};