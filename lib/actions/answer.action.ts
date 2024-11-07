"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;
    // const newAnswer = new Answer({ content, author, question });

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answer array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    /////////// Add interacion /////////////

    revalidatePath(path);
  } catch (error) {    
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;    

    const answers = await Answer.find({question: questionId })///////////////////////////////
      .populate({path: "author", model: User , select: "_id clerkId name picture"})
      .sort({ createdAt: -1 });
      
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
