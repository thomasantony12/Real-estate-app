import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState();
  const [state, setState] = useState(0);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const openChat = async (id, avatar, name, seenby) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if(seenby === "false"){
        setState(id);
        decrease();
      }
      setChat({ message: res.data, user: { avatar, name }, chat: { id } });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.chat.id, {
        message: text, seenby: "false",
      });
      setChat((prev) => ({
        ...prev,
        message: [...prev.message, res.data.messages[0]],
      }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: res.data.receiverId,
        data: res.data.messages[0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((element) => {
          return (
            <div
              className="message"
              key={element.id}
              style={{
                backgroundColor:
                  element.seenby === "true" || element.id === state
                    ? "white"
                    : "#fecd514e",
              }}
              onClick={() =>
                openChat(element.id, element.avatar, element.uname, element.seenby)
              }
            >
              <img src={element.avatar || "./noavatar.jpg"} alt="" />
              <span>{element.uname}</span>
              <p>{element.lastmsg}</p>
            </div>
          );
        })}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.user.avatar || "./noavatar.jpg"} alt="" />
              {chat.user.name}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.message.map((msg) => {
              return (
                <div
                  className="chatMessage"
                  style={{
                    alignSelf:
                      chat.chat.id === msg.chatid ? "flex-end" : "flex-start",
                    textAlign: chat.chat.id === msg.chatid ? "right" : "left",
                  }}
                  key={msg.id}
                >
                  <p>{msg.message}</p>
                  <span>{format(msg.createdat)}</span>
                </div>
              );
            })}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
