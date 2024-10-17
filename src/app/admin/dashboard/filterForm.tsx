"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangeForm } from "@/components/ui/datePicker";

const dashboardFilterSchema = z.object({
  // user info
  userName: z.string().optional(),
  userEmail: z.string().optional(), // dont validate for strict email (e.g. .email())) since we want to allow for searching for substr of email
  userPosition: z.string().optional(), // TODO: consider making this a dropdown value?
  userNotes: z.string().optional(),

  // course info
  courseExcludeCompleted: z.boolean().optional(),
  courseName: z.string().optional(),
  courseDateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
});

export default function FilterForm() {
  function onSubmit(values: z.infer<typeof dashboardFilterSchema>) {
    setPrefixes(new Map());
    console.log(values);
  }

  function addPrefix(id: string) {
    setPrefixes((p) => {
      return { ...p, [id]: "* " };
    });
  }

  const [prefixes, setPrefixes] = useState<Map<string, string>>(
    new Map<string, string>()
  );

  const form = useForm<z.infer<typeof dashboardFilterSchema>>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userPosition: "",
      userNotes: "",

      courseExcludeCompleted: false,
      courseName: "",
      courseDateRange: { from: "", to: "" },
    },
  });

  const req = {
    form: form,
    addPrefix: addPrefix,
    prefixes: prefixes,
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => form.reset({})}>
              <i className="ri-loop-left-line mr-2"></i>
              Reset
            </Button>
            <Button variant="secondary" type="submit">
              <i className="ri-edit-line mr-2"></i>
              Apply
            </Button>
          </div>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["userInfo", "courseInfo"]}
          >
            <AccordionItem value="userInfo">
              <AccordionTrigger>User Information</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  <Field
                    {...req}
                    type="input"
                    id="userName"
                    displayName="Name"
                  />
                  <Field
                    {...req}
                    type="input"
                    id="userEmail"
                    displayName="Email"
                  />
                  <Field
                    {...req}
                    type="input"
                    id="userPosition"
                    displayName="Position"
                  />
                  <Field
                    {...req}
                    type="textArea"
                    id="userNotes"
                    displayName="Notes"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="courseInfo">
              <AccordionTrigger>Course Information</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex flex-col gap-2">
                  <Field
                    {...req}
                    type="toggle"
                    id="courseExcludeCompleted"
                    displayName="Exclude Completed"
                  />
                  <Field
                    {...req}
                    type="input"
                    id="courseName"
                    displayName="Has Course"
                    placeholder="Name ..."
                  />
                  <Field
                    {...req}
                    type="dateRange"
                    id="courseDateRange"
                    displayName="Date Range"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </>
  );
}

type formFieldType = "input" | "textArea" | "toggle" | "dateRange";

interface formFieldProps {
  form: UseFormReturn;
  id: string;
  displayName: string;
  placeholder?: string;
  type: formFieldType;
  prefixes: Map<string, string>;
  addPrefix: (id: string) => void;
}

function Field({
  form,
  id,
  displayName,
  type,
  placeholder,
  prefixes,
  addPrefix,
}: formFieldProps) {
  if (!placeholder) placeholder = displayName + " ...";

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem onChange={() => addPrefix(id)}>
          <div className="flex flex-wrap items-center">
            <FormLabel className="min-w-[40%] text-nowrap">
              {/* For some arcane reason prefixes (type Map) may sometimes be passed down as generic object (dictionary) */}
              {prefixes instanceof Map ? prefixes.get(id) : prefixes[id]}
              {displayName}:{" "}
            </FormLabel>
            <FormControl>
              {getFieldType(type, placeholder!, field, () => addPrefix(id))}
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}

function getFieldType(
  type: formFieldType,
  placeholder: string,
  field: ControllerRenderProps,
  setPrefix: () => void
) {
  const defaultAttr = {
    placeholder: placeholder!,
    ...field,
  };

  switch (type) {
    default:
    case "input":
      return <Input className="w-auto flex-grow" {...defaultAttr} />;
    case "textArea":
      return (
        <>
          <hr className="hidden w-full"></hr>
          <Textarea className="is-form-input ml-2 mt-2" {...defaultAttr} />
        </>
      );
    case "toggle":
      return (
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      );
    case "dateRange":
      // for some reason, this onChange does not produce an onChange event that can be captured by the <FormItem> onChange
      // which means we have to pass the prefix state setter all the way down here
      return (
        <DateRangeForm
          onChange={(e) => {
            field.onChange(e);
            setPrefix();
          }}
        />
      );
  }
}
