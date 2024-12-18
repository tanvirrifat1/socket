import jwt from "jsonwebtoken";
import UserModel from "../modules/user.model.js";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await UserModel.findById(decoded.id).select("-password");

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
};

export default verifyUser;
