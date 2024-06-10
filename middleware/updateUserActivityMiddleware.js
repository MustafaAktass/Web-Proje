const updateUserActivityMiddleware = async (req, res, next) => {
    const sessionId = req.cookies.userId || req.sessionID || 'some_unique_session_identifier'; // Benzersiz kimlik
    await userController.updateUserActivity(sessionId);
    next();
};

module.exports = updateUserActivityMiddleware;