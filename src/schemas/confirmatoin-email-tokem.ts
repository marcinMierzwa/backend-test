import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class ConfirmationEmailToken extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ required: true })
  confirmationEmailToken: string;

  @Prop({ required: true })
  email: string;
}

export const ConfirmationEmailTokenSchema = SchemaFactory.createForClass(
  ConfirmationEmailToken,
);
