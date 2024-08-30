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
  
  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  