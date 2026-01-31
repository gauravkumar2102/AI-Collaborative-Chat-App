import socket from 'socket.io-client';


let socketIntance=null

export const InitialiseSocket=(projectid)=>{
    socketIntance=socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token') 
        },
        query: {    
            projectid: projectid 
        }

});
    return socketIntance;
}

export const recieveMessage=(eventname,cb)=>{
    if(!socketIntance) return;
    socketIntance.on(eventname, cb);
}

export const sendingMessage=(eventname,data)=>{
    if(!socketIntance) return;
    socketIntance.emit(eventname, data);
}