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
  const { username, email, password, avatar } = req.body;
  let updatedPassword = null;
  let updatedAvatar = null;

  try {
    if (id != tokenId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    const dbData = await db.query(
      "SELECT password, avatar FROM users WHERE id = $1;",
      [id]
    );

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedPassword = hashedPassword;
    } else {
      updatedPassword = dbData.rows[0].password;
    }

    avatar ? (updatedAvatar = avatar) : (updatedAvatar = dbData.rows[0].avatar);

    console.log(updatedPassword);
    const user = await db.query(
      "UPDATE users SET uname=$1, email=$2, password=$3, avatar=$4 WHERE id = $5 RETURNING *;",
      [username, email, updatedPassword, updatedAvatar, id]
    );
    const { pass, ...others } = user.rows[0];
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
    if (id != tokenId) {
      return res.status(403).json({ message: "Not authorized!" });
    }
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Users cannot delete!" });
  }
};

export const savePost = async (req, res) => {
  const uid = req.body.userId;
  const postId = req.body.postId;
  try {
    const result = await db.query(
      "SELECT * FROM savedposts WHERE userid = $1 AND postid = $2",
      [uid, postId]
    );
    if (!result.rows[0]) {
      await db.query(
        "INSERT INTO savedposts (userid, postid) VALUES ((SELECT id FROM users WHERE id = $1), (SELECT id FROM posts WHERE id = $2))",
        [uid, postId]
      );
      res.status(200).json({ message: "Post saved" });
    } else {
      await db.query(
        "DELETE FROM savedposts WHERE userid = $1 AND postid = $2",
        [uid, postId]
      );
      res.status(200).json({ message: "Post removed" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Cannot save post!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  const savedPostResponse = [];
  try {
    const response = await db.query(
      "SELECT * FROM users u JOIN posts p ON u.id=p.userid JOIN postdetails pd ON p.id = pd.postid WHERE u.id = $1;",
      [tokenUserId]
    );
    response.rows.forEach((element) => {
      delete element.password;
      delete element.email;
    });
    await Promise.all(
      response.rows.map(async (item) => {
        const images = await db.query(
          "SELECT * FROM postimages WHERE postid = $1;",
          [item.postid]
        );
        item.images = images.rows[0];
      })
    );
    
    // SAVED POST RETREVE
    
    const savedPost = await db.query(
      "SELECT * FROM savedposts WHERE userid = $1;",
      [tokenUserId]
    );
    
    console.log(savedPost.rows);
    await Promise.all(
      savedPost.rows.map(async (item) => {
        const response = await db.query(
          "SELECT * FROM users u JOIN posts p ON u.id=p.userid JOIN postdetails pd ON p.id = pd.postid WHERE u.id = $1 AND p.id= $2;",
          [item.userid, item.postid]
        );
        savedPostResponse.push(response.rows[0]);
      })
    );
    
    savedPostResponse.forEach((element) => {
      delete element.password;
      delete element.email;
    });
    
    await Promise.all(
      savedPostResponse.map(async (item) => {
        const images = await db.query(
          "SELECT * FROM postimages WHERE postid = $1;",
          [item.postid]
        );
        item.images = images.rows[0];
      })
    );
    
    res.status(200).json({posts: [response.rows], savedPosts: [savedPostResponse]});
  } catch (error) {
    console.log(error);
    res.status(200).json("Failed to get profile!");
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
try {
  const length = await db.query("SELECT count(*) FROM chat WHERE seenby = $1 and userid = $2",[false, tokenUserId]);
  res.status(200).json(length.rows[0].count);
} catch (error) {
  console.log(error);
}

}