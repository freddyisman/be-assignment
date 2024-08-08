const jwt = require("jsonwebtoken");

const extractBearerTokenFromHeaders = ({ authorization }) => {
    const bearerTokenIdentifier = "Bearer";
  
    if (!authorization) {
      throw new Error({ 
        code: "auth.authorization_header_missing", 
        status: 401 
    });
    }
  
    if (!authorization.startsWith(bearerTokenIdentifier)) {
      throw new Error({
        code: "auth.authorization_token_type_not_supported",
        status: 401,
      });
    }
  
    return authorization.slice(bearerTokenIdentifier.length + 1);
};

const verifyAuthFromRequest = async (req, res, next, supabase) => {
    try {
        const token = extractBearerTokenFromHeaders(req.headers);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            console.error('Token verification failed:', err);
          } else {
            console.log('Decoded token:', decoded);
            req.headers.token = token;
            req.headers.email = decoded.email;
          }
        });
        return next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).send({ error: 'Unauthorized' });
    }
};

module.exports = {
    verifyAuthFromRequest,
};