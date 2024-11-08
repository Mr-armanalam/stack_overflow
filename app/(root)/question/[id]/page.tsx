import React from "react";
import Image from "next/image";
import Link from "next/link";
import Metric from "@/components/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { getQuestionsById } from "@/lib/actions/question.action";
import { formatNumber, getTimestamp } from "@/lib/utils";

const page = async ({ params, searchParams }) => {
//   console.log(params);

const result = await getQuestionsById({questionId: params.id});

  return (<>
    <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
            <Link href={`/profile/${result.author.clerkId}`} className="flex flex-row items-center justify-start gap-1">
            <Image 
            src={result.author.picture}
            className="rounded-full"
            width={22}
            height={22}
            alt="profile picture"
            />

            <p className="paragraph-semibold text-dark300_light700">
                {result.author.name}
            </p>
            </Link>

            <div className="flex justify-end">
                VOTING
            </div>           
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
            {result.title}
        </h2>
    </div>
    <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric 
        imgUrl="/assets/icons/like.svg"
        alt="clock icon"
        value={`asked ${getTimestamp(result.createdAt)}`}
        title="Asked"
        textStyles= "small-medium text-dark400_light800"
        />
        <Metric 
        imgUrl="/assets/icons/message.svg"
        alt="Upvotes"
        value={formatNumber(result.answers?.length)}
        title="Answers"
        textStyles= "small-medium text-dark400_light800"
        />
        <Metric 
        imgUrl="/assets/icons/eye.svg"
        alt="eye"
        value={formatNumber(result.views)}
        title="Votes"
        textStyles= "small-medium text-dark400_light800"
        />
    </div>

    <ParseHTML data={result.content} />

    <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag:any) => (
            <RenderTag 
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                showCount={false}
            />
        ))}
    </div>
  </>)
};

export default page;
