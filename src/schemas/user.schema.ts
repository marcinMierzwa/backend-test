import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({
    versionKey: true
}) 
export class User extends Document {

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId;
  
    @Prop({required: true, unique: true})
    email: string;
  
    @Prop({required: true })
    password: string;
  
  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  