import mongoose,{Schema} from "mongoose";

const subscriptionSchema=new Schema({
      subscriber:{
        type:Schema.Types.ObjectId,
        // ones who is subscribing is also a user
        ref:"User"
      },
      channel:{
        type:Schema.Types.ObjectId,
        // the one wwhom the subscriber subscribes is also a User
        ref:"User "
      }
      
},{timestamps:true})

export const Subscription =mongoose.model("Subscription",subscriptionSchema);