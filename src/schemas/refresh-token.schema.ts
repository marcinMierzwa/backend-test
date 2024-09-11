import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
    versionKey: false,
    timestamps: true,
  })
export class RefreshToken extends Document {
    @Prop({ required: true })
    refreshToken: string;
  
    @Prop({ type: mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    expiryDate: Date;


  }
  
  export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
  
