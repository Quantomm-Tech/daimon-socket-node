import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: `https://enterprise-daimon-dev.us.auth0.com/.well-known/jwks.json`,
});

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado desde el api' });
    }

    function getKey(header: any, callback: any) {
        client.getSigningKey(header.kid, function (err: any, key: any) {
            if (err) {                    
                console.log('Error de Signingkey')
                return next(new Error('Error de Signingkey'));
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }

    // Verificar y decodificar el token JWT    
    jwt.verify(token, getKey, (err: any) => {
        if (err) {
            
            console.log('error: ', err)
            return res.status(401).json({ message: 'Error de autenticación' });
        }
        next();
    });
};
