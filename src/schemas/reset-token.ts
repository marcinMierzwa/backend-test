import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({versionKey: false, timestamps: true})
export class ResetToken extends Document {

    @Prop({ required: true })
    resetToken: string;

    @Prop({ required: true })
    expiryDate: Date;

    @Prop({ required: true, type:mongoose.Types.ObjectId })
    userId: mongoose.Types.ObjectId
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);