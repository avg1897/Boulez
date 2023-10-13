const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

exports.generateAccessToken = id => {
    return jwt.sign({userId: id}, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).send({message: "Error 401: Unauthorized"})

    jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenObj) => {
        if (err) return res.status(403).send({message: "Invalid or expired Token"})
        req.userId = tokenObj.userId
        next()
    })
}

exports.authenticateAdmin = (req, res, next) => {
    //leggere header
    let user = req.headers['x-user'];
    let pass = req.headers['x-pass'];

    if (!user || !pass) {
        return res.status(400).send({
            message: "This is a private Call only for Admin Users"
        });
    }
    let envPassHash = crypto.createHash('md5').update(process.env.API_PRIVATE_PASS).digest('hex');
    if (user !== process.env.API_PRIVATE_USER || pass !==  envPassHash) {
        return res.status(400).send({
            message: "This is a private Call only for Admin Users"
        });
    }
    next()
}