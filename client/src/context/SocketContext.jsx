import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:3001"))
    }, [])

    return <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
}