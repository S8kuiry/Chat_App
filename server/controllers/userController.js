import cloudinary from "../configs/cloudinary.js";
import { generateToken } from "../configs/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


// signup function -----------------

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        if (!email || !fullName || !password) {
            console.log("Missing input");
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        console.log("Found user:", user);

        if (user) {
            console.log("User exists already");
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
        });

        console.log("✅ New user created:", newUser);

        const token = generateToken(newUser._id);
        console.log("Generated token:", token);

        res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account Created Successfully",
        });

    } catch (error) {
        console.error("❌ Error in signup:", error);
        res.json({ success: false, message: error.message });
    }

};

// ----------- login function ----------------------
export const login = async (req,res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = generateToken(user._id)
                res.json({ success: true, message: `Welcome back ${user.fullName}`, userData: user, token })
            } else {
                res.json({ success: false, message: "Invalid Credentials" })
            }
        } else {
            res.json({ success: false, message: "User dosen't exist" })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })


    }
}
// -------------------- profile page fuction ---------------------
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      // 💡 You forgot to assign result to updatedUser here
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "chat-profile-pics",
  resource_type: "image",
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update profile failed:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error in checkAuth:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
