const User=require('../database/schema/User.model')
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports={getMe}