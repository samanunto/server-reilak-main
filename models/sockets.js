const { comprobarJWT } = require('../helpers/jwt');
const fs = require('fs');
const { usuarioConectado,
        usuarioDesconectado,
        grabarSala,
        getUsuarios,
        findMembers, 
        grabarMessage,
        iniciarConexion,
        terminarConexion,
        findUsuariosConectados,
        } = require('../controllers/sockets');const { listarNotificaciones } = require('../controllers/posts');
const { listarChat, findMeUserChat } = require('../controllers/chat');
const { buscarChat} = require('../controllers/chat');
const {findUserChatPersonal} = require('../controllers/chat');
class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {
            const [ valido, uid ] = comprobarJWT(socket.handshake.query['x-token'])
        
            if ( !valido ) {
                console.log('socket no identificado');
                return socket.disconnect();
            }
            await usuarioConectado(uid);
            await iniciarConexion(uid);
            const user = await findUsuariosConectados(uid);
            for(let i=0;i<user.length;i++){
                this.io.to(user[i]._id.toString()).emit('send-activo',user );
            }
            console.log('35 ',user)
   
            // Unir al usuario a una sala de socket.io
            socket.join( uid );

            socket.on( 'create-sala-chat', async( payload ) => {
                const chat = await grabarSala(payload);


                for(let i=0;i<chat.members.length;i++){
    
                    this.io.to(chat.members[i].toString()).emit('create-sala-chat',chat );
                }                  
            });

            socket.on('send-message', async(payload)=>{
                const chatExist = await buscarChat(payload)
                if(!chatExist){
                    let chat = await grabarSala(payload);
                    const userPersonalChat = await findUserChatPersonal(payload);
                    const meUserChat = await findMeUserChat(payload);

                    for(let i=0;i<chat.members.length;i++){
                        if(userPersonalChat._id.toString()===chat.members[i].toString()){

                            chat[["user"]]=meUserChat;
                            this.io.to(chat.members[i].toString()).emit('create-sala-chat',chat );
                        }else{
                            chat[["user"]]=userPersonalChat;
                            this.io.to(chat.members[i].toString()).emit('create-sala-chat',chat );
                        }
                        
                    }    
                    
        
                    payload["to"]=chat._id;
                    const message = await grabarMessage(payload);

                    const chatMember = await findMembers(message[0].to); 
    
                    for(let i=0;i<chatMember.members.length;i++){
                        this.io.to(chatMember.members[i].toString()).emit('send-message',message[0] );
                    }
                }
                else{
                    console.log('si existe');
                    const message = await grabarMessage(payload);
                    const chatMember = await findMembers(message[0].to); 
                    for(let i=0;i<chatMember.members.length;i++){
                        this.io.to(chatMember.members[i].toString()).emit('send-message',message[0] );
                    }
                }

            })

            // // TODO: Validar el JWT 
            // // Si el token no es válido, desconectar

            // // TODO: Saber que usuario está activo mediante el UID

            // TODO: Emitir notificacion
            // this.io.emit( 'notificacion', await listarNotificaciones() )

            // // TODO: Socket join, uid

            // // TODO: Escuchar cuando el cliente manda un mensaje
            // socket.on( 'mensaje-personal', async( payload ) => {
            //     const mensaje = await grabarMensaje( payload );
            //     this.io.to( payload.para ).emit( 'mensaje-personal', mensaje );
            //     this.io.to( payload.de ).emit( 'mensaje-personal', mensaje );
            // });
            

            // // TODO: Disconnect
            // // Marcar en la BD que el usuario se desconecto
            // // TODO: Emitir todos los usuarios conectados
            // socket.on('disconnect', async() => {
            //     await usuarioDesconectado( uid );
            //     this.io.emit( 'lista-usuarios', await getUsuarios() )
            // })
            
            socket.on('disconnect', async()=>{
                await usuarioDesconectado( uid );
                await terminarConexion( uid );
                console.log('se desconecto');
            })
        
        });
    }


}


module.exports = Sockets;