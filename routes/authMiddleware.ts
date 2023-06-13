import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: `https://enterprise-daimon-dev.us.auth0.com/.well-known/jwks.json`,
});

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }

    function getKey(header: any, callback: any) {
        client.getSigningKey(header.kid, function (err: any, key: any) {
            if (err) {                    
                return next(new Error('Error de Signingkey'));
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    }

    // Verificar y decodificar el token JWT
    //@ts-ignore
    jwt.verify(token, getKey, (err: any, decoded: JwtPayload | undefined) => {
        if (err) {
        return res.status(401).json({ message: 'Error de autenticación' });
        }

        // El token es válido, se puede acceder a la propiedad 'decoded' para obtener información adicional si es necesario
        //@ts-ignore
        req.decoded = decoded;
        next();
    });
};
