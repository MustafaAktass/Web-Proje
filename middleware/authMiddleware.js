const User = require('../model/user');
const jwt = require('jsonwebtoken')

exports.authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.cookieJWT;
        //console.log(token);
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async(err, decoded) => {
                if (err) {
                    console.log(err.message);
                    res.redirect("/auth/login");
                } else { 
                    req.user = decoded;
                    next();
                }
            });
        } else {
            res.redirect("/auth/login");
        }
    } catch (error) {
        res.json({
            succeeded: false,
            error: "Not authorized"
        });
    }
};
exports.setUserRole = async (req, res, next) => {
    const token = req.cookies.cookieJWT;
    if (!token) {
        req.user = { role: 'user' };
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        req.user = { role: user ? user.role : 'user' };
        next();
    } catch (err) {
        req.user = { role: 'user' };
        next();
    }
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send("Access denied");
    }
};





