const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // get token from header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // verify
    try {
        const secret = process.env.JWT_SECRET || 'betterme_dev_secret';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
