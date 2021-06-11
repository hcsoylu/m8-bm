import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["host", "guest"],
      default: "guest",
    },
    accomodation: [{ type: Schema.Types.ObjectId, ref: "accomodaiton" }],
    refreshToken: {
      token: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.findByCredentials = async function (email, plainPW) {
  const user = await this.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(plainPW, user.password);
    if (match) return user;
  } else {
    return null;
  }
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

export default UserModel = model("User", UserSchema);
