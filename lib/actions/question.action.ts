"user server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";

export async function createQuestion(params: any) {
  try {
    connectToDatabase();

    const { title, content, tags, author } = params;

    const question:any = await Question.create(title, content, tags, author); //////////////////////////////////

    const tagDocuments = [];

    // create the tages or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {name: {$regex: new RegExp(`^${tag}$`, "i")}}, // finding paramater by regular expression with case insensitive
        { $setOnInsert: { name: tag}, $push: {question: question._id}}, // on it
        { upsert: true, new: true}, // additional provide information (to create a new tag if no match found)
      );

      tagDocuments.push(existingTag._id);

      await Question.findByIdAndUpdate(question._id, {
        $push: { tags: {$each: tagDocuments} },
      })
    }

    // create an interaction record for the user's ask_question

    //Increment author's reputation by +5 for creatintg a question
  } catch (error) {
    // Handle database connection errors
    console.error("Failed to connect to database:", error);
    throw error;
  }
}
