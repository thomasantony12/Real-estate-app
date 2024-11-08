import db from "../db.js";

export const addMessage = async (req, res) => {
  const chatId = req.url.slice(1);
  const message = req.body.message;
    try {
      const chat = await db.query("SELECT id FROM msg WHERE chatid = $1",[chatId]);
      if(!chat.rows)  return res.status(404).json({message : "Chat not Found!"}) ;

      const result = await db.query("INSERT INTO msg (chatid, message) VALUES ($1,$2) RETURNING *", [ chatId, message]);
      await db.query("UPDATE chat SET lastmsg = $2 WHERE id = $3 RETURNING *", [message, chatId]);
      // console.log(up.rows);

      res.status(200).json(result.rows);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add message!" });
    }
  };