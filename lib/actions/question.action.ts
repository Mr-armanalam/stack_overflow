"use server";
import mongoose from 'mongoose';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import { connectToDatabase } from '../mongoose';
import { CreateQuestionParams, GetQuestionByIdParams, GetQuestionsParams } from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';



export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
    .populate( {path: 'tags', model: Tag})
    .populate( {path: 'author', model: User})
    .sort({ createdAt: -1});

    return {questions}
  } catch (error) {
    console.log(error);
    throw error
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the tags or get their ObjectId if they already exist
    const tagDocuments = [];
    for (const tag of tags) {

      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // finding parameter by regular expression with case insensitive
        { $setOnInsert: { name: tag }, $push: { questions: new mongoose.Types.ObjectId() } }, // on it
        { upsert: true, new: true, setDefaultsOnInsert: true } // additional provide information (to create a new tag if no match found)
      );

      tagDocuments.push(existingTag._id);
      
    }  
    
    const question = await Question.create({ title, content, tags: tagDocuments, author });

    // await Question.findByIdAndUpdate(question._id, {
    //   $push: { tags: { $each: tagDocuments } },
    // });

    revalidatePath(path)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestionsById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const {questionId} = params;

    const question = await Question.findById(questionId)
   .populate( {path: 'tags', model: Tag, select: '_id name'})
   .populate( {path: 'author', model: User, select: '_id clerkId name picture'});

   return question;

  }catch (error) {
    console.log(error);
    throw error;
    
  }
}
