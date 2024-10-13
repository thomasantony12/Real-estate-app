import db from "../db.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users;");
    res.status(200).json(users.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Users cannot get!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.url.slice(1);
  try {
    const user = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
    res.status(200).json(user.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User cannot get!" });
  }
};
export const updateUser = async (req, res) => {
    const id = req.url.slice(1);
    const tokenId = req.userId;
    const {username, email, password, avatar} = req.body;
    let updatedPassword = null;
    let updatedAvatar = null;
    
  try {
    if( id != tokenId ) {return res.status(403).json({ message : "Not authorized!"})}

    const dbData = await db.query("SELECT password, avatar FROM users WHERE id = $1;", [id]);

    if(password){
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedPassword = hashedPassword;
    } else {
        updatedPassword = dbData.rows[0].password;
    }

    avatar ? updatedAvatar = avatar : updatedAvatar = dbData.rows[0].avatar;
    
    
    console.log(updatedPassword);
    const user = await db.query("UPDATE users SET uname=$1, email=$2, password=$3, avatar=$4 WHERE id = $5 RETURNING *;", [username, email, updatedPassword, updatedAvatar, id]);
    const { pass, ...others} = user.rows[0];
    res.status(200).json(others);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User cannot update!" });
  }
};
export const deleteUser = async (req, res) => {
    const id = req.url.slice(1);
    const tokenId = req.userId;
  try {
    if( id != tokenId ) {return res.status(403).json({ message : "Not authorized!"})}
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message : "User deleted successfully"})
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Users cannot delete!" });
  }
};
