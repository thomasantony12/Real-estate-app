import db from "../db.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const result = await db.query("SELECT * FROM chat WHERE userid = $1", [
      tokenUserId,
    ]);
    console.log(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chats cannot get!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const toUserId = req.url.slice(1);
  try {
    const result = await db.query(
      "SELECT * FROM msg WHERE chatid IN ( SELECT id FROM chat WHERE (userid = $1 AND tousersid = $2) OR (userid = $3 AND tousersid = $4))",
      [tokenUserId, toUserId,  toUserId, tokenUserId]
    );
    // console.log(result.rows);
    res.status(200).json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chat cannot get!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const touserid = req.body.receiverid;
  try {
    const result = await db.query(
      "INSERT INTO chat (userid, tousersid, seenby) VALUES ($1, $2, *3) RETURNING *",
      [tokenUserId, touserid, false]
    );
    // console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chat cannot add!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const touserid = req.url.slice(1);
  try {
    const result = db.query("UPDATE chat SET seenby = $1 WHERE userid = $2 AND tousersid = $3 RETURNING *", [ true, tokenUserId, touserid])
    res.status(200).json((await result.rows));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chats cannot read!" });
  }
};
