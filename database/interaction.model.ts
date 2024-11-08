import { Schema, model, models, Document } from "mongoose";

export interface IInteraction extends Document {                 ////////// ctrl + f -replace /////////////
  user: Schema.Types.ObjectId;
  action: string;
  questions: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  questions: { type: Schema.Types.ObjectId, ref: "Question" },
  answers: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
