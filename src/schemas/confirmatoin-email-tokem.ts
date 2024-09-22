import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class ConfirmationEmailToken extends Document {

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
