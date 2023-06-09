import { Socket } from 'socket.io';
import socketIO from 'socket.io';


export const disconnect = ( client:Socket )=>{

    client.on('disconnect', ()=>{
        console.log('Client disconnected\n');
        
      })

}



// Escuchar mensajes
export const mensaje = ( client:Socket ,io: socketIO.Server ) =>{

  client.on('client-Mensaje', ( payload: {mensaje:string, docType: string, fecha:Date}, callback )=>{

    const id = 123456;
    callback({ id, fecha : new Date().getTime() , msg: 'Confirmo recepcion del mensaje'});

    // servidor de socket emite a todos los clientes
    io.emit('server-message-allclients', payload);
    
});

}

