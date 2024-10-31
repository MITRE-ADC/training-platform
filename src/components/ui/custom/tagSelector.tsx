"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Tag, TagInput } from "../tag/tag-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../form";

interface TagSelectorProps {
  title: string;
  id: string;
  tags: Tag[];
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
}

export function TagSelector({
  title,
  // eslint-disable-next-line
  id,
  tags,
  selectedTags,
  setSelectedTags,
}: TagSelectorProps) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const schema = z.object({
    values: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      values: [],
    },
  });

  return (
    <div className="flex items-center justify-end">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => console.log(v))}
          className="flex"
        >
          <FormField
            control={form.control}
            name="values"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagInput
                    {...field}
                    tags={selectedTags}
                    setTags={(t) => {
                      setSelectedTags(t);
                      form.setValue("values", t as [Tag, ...Tag[]]);
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    autocompleteOptions={tags}
                    size="sm"
                    enableAutocomplete
                    restrictTagsToAutocompleteOptions
                    styleClasses={{
                      autoComplete: {
                        command: "bg-secondary",
                        popoverTrigger: "bg-secondary w-fit",
                        commandList: "list-none",
                        commandGroup: "font-bold",
                        commandItem: "cursor-pointer hover:bg-gray-100",
                        popoverTriggerName: title,
                      },
                      inlineTagsContainer: "bg-secondary",
                      tag: {
                        body: "flex items-center bg-white main-outline mx-[1px]",
                        closeButton: "text-red-500 hover:text-red-600",
                      },
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
