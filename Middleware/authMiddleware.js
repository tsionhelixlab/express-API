const JWT = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader =
        req.headers.authorization;


    if (!authHeader) {

        return res.status(401).json({
            error: 'Authorization required'
        });

    }


    const parts =
        authHeader.split(' ');


    if (
        parts.length !== 2 ||
        parts[0] !== 'Bearer'
    ) {

        return res.status(401).json({
            error: 'Invalid authorization format'
        });

    }


    const token = parts[1];


    JWT.verify(
        token,
        process.env.JWT_SECRET,
        (err, verified) => {

            if (err) {

                return res.status(401).json({
                    error: 'Invalid token'
                });

            }


            req.user = verified;

            next();

        }
    );

};


module.exports = authMiddleware;