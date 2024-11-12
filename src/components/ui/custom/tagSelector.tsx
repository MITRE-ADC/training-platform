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
  titleClass: string;
}

export function TagSelector({
  title,
  // eslint-disable-next-line
  id,
  tags,
  selectedTags,
  setSelectedTags,
  titleClass,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => console.log(v))}>
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
                      command: "bg-white",
                      popoverTrigger: "bg-white w-fit",
                      commandList: "list-none",
                      commandGroup: "",
                      commandItem: "cursor-pointer",
                      popoverTriggerName: title,
                      title: titleClass,
                    },
                    inlineTagsContainer: "bg-white",
                    tag: {
                      body: "bg-lightBlue text-dark rounded-lg pl-4 hover:bg-lightBlue/80",
                      closeButton: "",
                    },
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
