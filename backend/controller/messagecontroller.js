import Message from "../model/message.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      msg: "Message sent successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};