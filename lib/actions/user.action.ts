"use server"

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";


export async function getUserById(params: GetUserByIdParams) { //////////////edited //////////////
    try {
        connectToDatabase();

        const {userId} = params ;

        const user = await User.findOne({clerkId: userId});

        return user;
    } catch (error) {
        console.log(error);
        throw error     
    }
}


export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser = await User.create(userData);

        return newUser;
    } catch (error) {
        console.log(error);
        throw error     
    }
}
export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const { clerkId, updateData, path} = params ;

        const newUser = await User.findOneAndUpdate({clerkId}, updateData, {new: true});

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error     
    }
}
export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const { clerkId} = params ;

        const user = await User.findOneAndDelete({clerkId});

        if(!user) {
            throw new Error("User not found");
        }
        // Delete user from database
        // and question, answers, comments, etc.

        //get user question ids
        const userQuestionIds = await Question.find({author: user._id}).distinct('_id')

        // Delete all user's questions
        await Question.deleteMany({author: user._id});

        ///////////// Delete usr comment and anser ///////////////

        const deletedUser = await User.findByIdAndDelete(user._id);
    } catch (error) {
        console.log(error);
        throw error     
    }
}