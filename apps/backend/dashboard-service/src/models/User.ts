import mongoose, { Schema} from 'mongoose';
import { IUser } from '../../types';


// Define the Post schema
const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
    password: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        required:true,
    }
  }
);

// Export the Post model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
