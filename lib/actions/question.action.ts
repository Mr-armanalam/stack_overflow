"use server";
import mongoose from 'mongoose';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import { connectToDatabase } from '../mongoose';
import { CreateQuestionParams, GetQuestionsParams } from './shared.types';
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

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path)
    // return question;
  } catch (error) {
    console.error(error);
    throw error;
  }
}













// \\\\\\\\\\\\\\\\\\\\\




// 'use server'
// import Question from '@/database/question.model';
// import Tag from '@/database/tag.model';
// import { connectToDatabase } from '../mongoose';

// export async function createQuestion(params: any) {
//   try {
//     await connectToDatabase();

//     const { title, content, tags, author } = params;
//     // console.log(Tag.find());
    

//     const question = await Question.create({ title, content, tags, author });

//     const tagDocuments = [];

//     // create the tags or get them if they already exist
//     for (const tag of tags) {
//       const existingTag = await Tag.findOneAndUpdate(
//         { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // finding parameter by regular expression with case insensitive
//         { $setOnInsert: { name: tag }, $push: { questions: question._id } }, // on it
//         { upsert: true, new: true } // additional provide information (to create a new tag if no match found)
//       );

//       tagDocuments.push(existingTag._id);
//     }

//     await Question.findByIdAndUpdate(question._id, {
//       $push: { tags: { $each: tagDocuments } },
//     });

//     return question;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
