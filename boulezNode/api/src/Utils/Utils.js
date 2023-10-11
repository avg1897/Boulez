const jwt = require('jsonwebtoken');

exports.validatePassword = password => {
    if(password.length < 8) {
        throw new Error('Error: Password must be at least 8 characters');
    } else if(password.search(/[a-z]/) < 0) {
        throw new Error('Error: Password must contain at least one lowercase letter');
    } else if(password.search(/[A-Z]/) < 0) {
        throw new Error('Error: Password must contain at least one uppercase letter');
    } else if(password.search(/[0-9]/) < 0) {
        throw new Error('Error: Password must contain at least one number');
    } else {
        return true;
    }
}

exports.generateAccessToken = username => {
    return jwt.sign({user: username}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({message: "Error 401: Unauthorized"})

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).send({message: "Invalid or expired Token"})
        req.user = user
        next()
    })
}