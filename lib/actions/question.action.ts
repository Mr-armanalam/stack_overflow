"use server";
import mongoose, { FilterQuery } from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { connectToDatabase } from "../mongoose";
import { CreateQuestionParams,  DeleteAnswerParams, DeleteQuestionParams, EditQuestionParams,
          GetQuestionByIdParams, GetQuestionsParams, QuestionVoteParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter } = params;

    const query : FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") }},
        { content: { $regex: new RegExp(searchQuery, "i") }},
      ]
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1}
       break;
      case "frequent":
        sortOptions = { views: -1}
        break;
      case "unanswered":
        query.answers = { $size: 0}
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

    const tagDocuments = [];

    //////////////////////////////////// Extra but usefull ////////////////////////////////////////////////////////////

    // Create the tags or get their ObjectId if they already exist
    // for (const tag of tags) {

    //   const existingTag = await Tag.findOneAndUpdate(
    //     { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // finding parameter by regular expression with case insensitive
    //     { $setOnInsert: { name: tag }, $push: { questions: new mongoose.Types.ObjectId() } }, // on it
    //     { upsert: true, new: true, setDefaultsOnInsert: true } // additional provide information (to create a new tag if no match found)
    //   );

    //   tagDocuments.push(existingTag._id);

    // }

    // const question = await Question.create({ title, content, tags: tagDocuments, author });

    /////////////////////////////////// End ////////////////////////////////////////////////////////////////////////

    const question = await Question.create({ title, content, author });

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestionsById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    /////////////// Increment author's reputation //////////////////
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    /////////////// Increment author's reputation //////////////////
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany({ question: questionId },{ $pull: { questions: questionId } });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId ); 

    if(!answer) {
      throw new Error("Answer not found");
    }
    await Answer.deleteOne({_id: answerId}); //////////////////////////////////////////////////////////////////
    await Question.updateMany({ _id: answer.question },{ $pull: { answers: answerId } });
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if(!question) throw new Error("Question not found");

    question.title = title;
    question.content = content;

    await question.save();
   
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
        .sort({ views: -1, upvotes: -1 })   /////////// descending order //////////
        .limit(5);

        return hotQuestions;

    } catch (error) {
        console.log(error);
        throw error 
    }
}
