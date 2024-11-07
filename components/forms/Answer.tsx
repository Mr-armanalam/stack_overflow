"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mode } = useTheme();
  const editorRef = React.useRef(null);
  const form = useForm<z.infer<typeof AnserSchema>>({
    resolver: zodResolver(AnserSchema),
    defaultValues: {
      answer: "",
    },
  }); // follow sadcn

  const handleCreateAnswer = async (values: z.infer<typeof AnserSchema>) => {
    setIsSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 flex items-center 
        text-primary-500 shadow-none dark:text-primary-500"
          onClick={() => {}}
        >
          <Image
            src={"/assets/icons/stars.svg"}
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate an AI Answer
        </button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_tINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(_evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "codesample",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | " +
                        "bold codesample italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                  {/* todo add an editor component */}
                </FormControl>
                <FormMessage className="text-red-900" />
              </FormItem>
            )}
          />
          <div className="flex mt-4 text-white justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
