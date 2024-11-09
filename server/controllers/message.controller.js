import db from "../db.js";

export const addMessage = async (req, res) => {
  const chatId = req.url.slice(1);
  const message = req.body.message;
    try {
      const chat = await db.query("SELECT id FROM msg WHERE chatid = $1",[chatId]);
      if(!chat.rows)  return res.status(404).json({message : "Chat not Found!"});
      
      const result = await db.query("INSERT INTO msg (chatid, message) VALUES ($1, $2) RETURNING *", [ chatId, message]);

      const users = await db.query("SELECT * FROM chat WHERE id = $1",[chatId]);
      const cUser = users.rows[0].userid;
      const toUser = users.rows[0].tousersid;
      await db.query("UPDATE chat SET lastmsg = $1 WHERE (userid = $2 AND tousersid = $3) OR (userid = $3 AND tousersid = $2) RETURNING *", [message, cUser, toUser] );
      // console.log(up.rows);

      res.status(200).json({messages : result.rows, receiverId : toUser});
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add message!" });
    }
  };