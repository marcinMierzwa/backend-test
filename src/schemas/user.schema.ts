import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



@Schema({
    versionKey:false,
    timestamps: true
}) 
export class User extends Document {

   
    _id: mongoose.Types.ObjectId  // @Prop({type:mongoose.Types.ObjectId })
  
    @Prop({required: true, unique: true})
    email: string;
  
    @Prop()
    password: string;

    @Prop()
    googleId: string;

    @Prop({default: 'local'})
    authMethod: string // local or google

    @Prop({required: true })
    isEmailAdressConfirmed: boolean;

    @Prop({default:""})
    avatarUrl: string;



  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  