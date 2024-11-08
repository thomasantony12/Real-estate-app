import db from "../db.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const result = await db.query("SELECT * FROM chat WHERE userid = $1", [
      tokenUserId,
    ]);
    // console.log(result.rows);

    await Promise.all(
     result.rows.map(async (element) => {
      const userDetail = await db.query("SELECT * FROM users WHERE id = $1", [
        element.tousersid
      ]);
      delete userDetail.rows[0].password;
      delete userDetail.rows[0].email;
      delete userDetail.rows[0].id;
      Object.assign(element, userDetail.rows[0]);
     })
    );

    // console.log(result.rows);
    res.status(200).json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Chats cannot get!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.url.slice(1);

  try {
    await db.query("UPDATE chat SET seenby = $1 WHERE id = $2 RETURNING *", [true, chatId]);
    const chats = await db.query("SELECT tousersid FROM chat WHERE id = $1",[chatId]);
    const toUserChatId = await db.query("SELECT id FROM chat WHERE userid = $1 AND tousersid = $2",[chats.rows[0].tousersid, tokenUserId])
    // console.log(toUserChatId.rows[0].id);
    // console.log(chatId);

    const result = await db.query(
      "SELECT * FROM msg WHERE chatid IN ($1, $2) ORDER BY createdat",
      [chatId, toUserChatId.rows[0].id]
    );

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
    const chatExist = await db.query("SELECT id FROM chat WHERE userid = $1 AND tousersid = $2",[tokenUserId, touserid])
    if(chatExist.rows[0]) return res.status(401).json({message : " Chat already exists!"});

    await db.query(
      "INSERT INTO chat (userid, tousersid, seenby) VALUES ($1, $2, $3) RETURNING *",
      [ touserid, tokenUserId, false]
    );
    const result = await db.query(
      "INSERT INTO chat (userid, tousersid, seenby) VALUES ($1, $2, $3) RETURNING *",
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
