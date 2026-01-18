import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  _id: String, // phone
  name: String,
  phone: String,
  role: String,
  verified: { type: Boolean, default: false },
  subscription: {
    required: false,
    type: {
      endpoint: String,
      expirationTime: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      keys: {
        p256dh: String,
        auth: String,
      }
    }
  }

}, { timestamps: true })

export default mongoose.models.User || mongoose.model("User", UserSchema)
