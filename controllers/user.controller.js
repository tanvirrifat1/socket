import UserModel from "../modules/user.model.js";

const GetAllUser = async (req, res) => {
  try {
    const loginUser = req.user._id;

    const users = await UserModel.find({ _id: { $ne: loginUser } }).select(
      "-password"
    );
    res.status(200).json({ message: "success", users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { GetAllUser };
