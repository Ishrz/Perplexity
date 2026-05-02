import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
     
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Middleware: Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return ;

  try {
 
    this.password = await bcrypt.hash(this.password, 10);
    // next();
  } catch (error) {
    // next(error);
    throw error
  }
});

// Method: Compare password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model('User', userSchema);

export default userModel