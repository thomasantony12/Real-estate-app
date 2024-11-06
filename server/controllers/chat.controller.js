import db from "../db.js";

export const getChats = async (req, res) => {
    try {

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Chats cannot get!" });
    }
  };

export const getChat = async (req, res) => {
    try {

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Chat cannot get!" });
    }
  };

export const addChat = async (req, res) => {
    try {

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Chat cannot add!" });
    }
  };

export const readChat = async (req, res) => {
    try {

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Chats cannot read!" });
    }
  };