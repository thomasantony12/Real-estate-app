import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  // HASH THE PASSWORD
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // CREATE NEW USER

    const avatar = 1;
    await db.query(
      "INSERT INTO users (email, uname, password, avatar) VALUES ($1, $2, $3, $4)",
      [email, username, hashedPassword, avatar]
    );
    res.status(201).json({ message: "user added succesfully" });
    // console.log(avatar);
  } catch (err) {
    res.status(500).json({ message: "faild to create user" });
    // console.log("already exist", err);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try{
    const user = await db.query("SELECT * FROM users WHERE uname = $1", [
      username,
    ]);
    
    // CHECK THE USER IS EXISTING
    
    if (!user)  return res.status(500).json({ message: "Invalid cridentials!" });

    // CHECK THE PASSWORD IS MATCHING WITH THE USERNAME

    if (! await bcrypt.compare(password, user.rows[0].password)) return res.status(500).json({ message: "Invalid cridentials!" });
  

    // GENERATE A COOKIE TOKEN AND GIVE IT TO USER

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign({
      id : user.rows[0].id
    }, process.env.JWT_KEY, {
      expiresIn: age
    });

    res.cookie("Token", token, {
      httpOnly: true,
      // secure: true,
      maxAge : age
    }).status(200).json({ message : "Login successful"})


  }catch (err){


    console.log(err);
    res.status(500).json( { message : "failed to login!"});


  }
};

export const logout = (req, res) => {
  res.clearCookie("Token").status(200).json({ message : "Logout successful"});
};
