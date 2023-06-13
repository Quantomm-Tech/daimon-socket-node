
import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://enterprise-daimon-dev.us.auth0.com/.well-known/jwks.json`,
});

export default class Server {

    private static _instance : Server;
    public app: express.Application;
    public port: number;

    public io: socketIO.Server;

    private httpServer: http.Server;

    private constructor() {

        
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = new socketIO.Server(this.httpServer,{
            cors: {
              origin: '*'
            }});

        
        this.app.set("io", this.io);

        this.listenSockets();
            
        
    }

    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    private listenSockets() {

        this.io.use((socket, next) => {
            
            const token = socket.handshake.auth.token;
            
            if (!token) {
              const error = new Error('Token de autenticación no proporcionado');
              console.error(error);
              return next(error);
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
            jwt.verify(token, getKey, (err: any, decoded: JwtPayload | undefined) => {
              if (err) {
                console.error('Error de autenticación: ', err)
                // El token no es válido, rechazar la conexión
                return next(new Error('Error de autenticación'));
              }
        
              next();
            });
        });
      
        this.io.on("connection", (client) => {
          console.log("New Client connected: ", client.id);

          // Mensajes
          socket.mensaje( client ,this.io);

          // Desconectar
          socket.disconnect( client );

          // this.discconectAll()

        });
    }

    
    private discconectAll() {
      this.io.disconnectSockets()
    
      console.log('desconectar sockets')
    }

    start( callback: Function ) {

        this.httpServer.listen( this.port, callback() );

    }

}