import { useContext, useState } from "react";
import "./chat.scss";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { socket } = useContext(SocketContext);
  // console.log(chats);
  const openChat = async (id, avatar, name) => {
    try {
      console.log(id);
      const res = await apiRequest("/chats/" + id);
      // console.log(res.data);
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
        message: text,
      });
      setChat((prev) => ({ ...prev, message: [...prev.message, res.data[0]] }));
      console.log(chat);
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

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
                  element.seenby == "true" ? "white" : "#fecd514e",
              }}
              onClick={() =>
                openChat(element.id, element.avatar, element.uname)
              }
            >
              <img src={element.avatar || "./noavatar.jpg"} alt="" />
              <span>{element.uname}</span>
              {console.log(element.lastmsg)}
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
