import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';


@Schema({
    versionKey:false,
    timestamps: true
}) 
export class User extends Document {

  
    @Prop({required: true, unique: true})
    email: string;
  
    @Prop({required: true })
    password: string;

    @Prop()
    isEmailAdressConfirmed: boolean

  }
  
  export const UserSchema = SchemaFactory.createForClass(User);
  