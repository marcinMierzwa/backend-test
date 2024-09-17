import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({
    versionKey:false,
    timestamps: true
}) 
export class User extends Document {

  
    @Prop({required: true, unique: true})
    email: string;
  
    @Prop({required: true })
    password: string;

    @Prop({required: true })
    isEmailAdressConfirmed: boolean;

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    _id: mongoose.Types.ObjectId

  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  