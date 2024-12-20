/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spaced-comment */
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestion } from "@/lib/actions/user.action";
// import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";


type SearchParams = Promise<{ [key: string]: string | undefined }>

const Collection = async (prop: {searchParams : SearchParams} ) => {
  const searchparams = await prop.searchParams;

    const { userId } = await auth();

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (!userId) null;

  const result = await getSavedQuestion({
    clerkId : userId!,  ///////////// modified ///////////////
    searchQuery: searchparams.q,
    page: searchparams.page ? +searchparams.page : 1,
  });  

  return (
    <>
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ?
        result.questions.map((question:any)=> (
          <QuestionCard 
          key={question._id}
          _id={question._id}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
          />
        )): 
        <NoResult 
        title="There&apos;s no saved question to show"
        description=" Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
        link="/ask-question"
        linkTitle="Ask a Question"
        />}
      </div>

      <div className="mt-10">
        <Pagination 
          pageNumber={searchparams?.page ? +searchparams.page: 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Collection;
