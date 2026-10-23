import { mongoose } from "mongoose";
import validate from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: (email) => {
        if (!validate.isEmail(email)) {
          throw new Error("Invalid email address");
        }
      },
      unique: true,
    },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    voteStatus: {
      status: { type: Boolean, default: false },
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates",
        default: null,
      },
    },
    mobile: {
      type: String,
      required: true,
    },
    voterId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    throw new Error("Error hashing password");
  }
  return hashedPassword;
};

userSchema.methods.comparePassword = async function (pass) {
  const user = this;
  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }
  return isMatch;
};

const User = mongoose.model("user", userSchema);

export default User;
