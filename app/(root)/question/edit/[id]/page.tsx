import Question from '@/components/components/Question'
import { getQuestionsById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
// import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server'
import React from 'react'

type Params = Promise<{ id: string }>

const Page = async (prop:{params: Params}) => {
  const paramsId = await prop.params;

  const { userId} = await auth();

  if(!userId) return null;

  const mongoUser = await getUserById({ userId});
  const result = await getQuestionsById({ questionId: paramsId.id}); // params.id

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>

      <div className="mt-9">
        <Question 
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  )
}

export default Page