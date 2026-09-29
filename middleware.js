import jwt from 'jsonwebtoken';


export const loggerMiddleware = (req, res, next) => {

  const timestamp = new Date().toLocaleTimeString();

  console.log(
    `[${req.method}] ${req.originalUrl} - ${timestamp}`
  );

  next();
};




const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, 'secretkey');
        console.log(decoded.id);
        req.id = decoded.id;
        next();
    } catch (error) {
        return res.status(400).send({ message: 'Invalid token.' });
    }
};

export default authMiddleware;