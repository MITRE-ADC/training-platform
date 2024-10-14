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
import { FormEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangeForm } from "@/components/ui/datePicker";

/** Buffer for form inputs that have been marked as changed (via `markChange`) */
const changedForms: HTMLElement[] = [];

/**
 * Denotes that a form input field as been changed, but those changes have not yet been applied
 * Does this by appending a * in front of the label
 * @param ele Label to change. If it is not a label, will first search siblings then children for a label element
 * @param hasChange Whether or not to mark the field as having changed
 * @see changedForms for storage of inputs that have been marked
 */
function markChange(ele: HTMLElement, hasChange: boolean = true) {
  // TODO: this is not maintained when opening/closing accordion
  let label: HTMLElement | null = null;

  if (ele.tagName != "LABEL") {
    if (!ele.parentElement) {
      console.warn(
        "Attempting to mark form input as changed, but input does not have a parent element."
      );
      return;
    }

    const n = ele.parentElement.childElementCount!;

    // .querySelector and .contains search recursively; we only want direct children
    for (let i = 0; i < n; i++) {
      const c = ele.parentElement.children[i]!;

      if (c.tagName == "LABEL") {
        label = c as HTMLElement;
        break;
      }
    }

    if (!label) label = ele.querySelector("label");
  } else label = ele;

  if (!label) {
    console.warn(
      "Attempting to mark form input as changed, but there is no associated label."
    );
    return;
  }

  if (!label.textContent) return;

  // now mark change
  if (hasChange) {
    if (!label.textContent.startsWith("* ")) {
      changedForms.push(ele);
      label.textContent = "* " + label.textContent;
    }
  } else label.textContent = label.textContent.replace("*", "")!;
}

/**
 * Due to the parent-child structure of react, it is easier to have the parent control all form data
 * rather than having each child be their separate form and then coordinate the two together from parent
 * While this is much easier implementation-wise (no prop/state spam), it means we have to package all
 * form data into a single schema
 */
const dashboardFilterSchema = z.object({
  // user info
  userName: z.string().optional(),
  userEmail: z.string().optional(), // dont validate for strict email (e.g. .email())) since we want to allow for searching for substr of email
  userPosition: z.string().optional(), // TODO: consider making this a dropdown value?
  userNotes: z.string().optional(),

  // course info
  courseExcludeCompleted: z.boolean().optional(),
  courseName: z.string().optional(),
  courseDateRange: z.string().optional(),
});

export default function FilterForm() {
  const form = useForm<z.infer<typeof dashboardFilterSchema>>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      userName: "",
      userEmail: "",
      userPosition: "",
      userNotes: "",

      courseExcludeCompleted: false,
      courseName: "",
      courseDateRange: "~ _ ~",
    },
  });

  function onSubmit(values: z.infer<typeof dashboardFilterSchema>) {
    changedForms.forEach((e) => markChange(e, false));
    changedForms.length = 0;

    console.log(values);
  }

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
                    form={form}
                    type="input"
                    id="userName"
                    displayName="Name"
                  />
                  <Field
                    form={form}
                    type="input"
                    id="userEmail"
                    displayName="Email"
                  />
                  <Field
                    form={form}
                    type="input"
                    id="userPosition"
                    displayName="Position"
                  />
                  <Field
                    form={form}
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
                    form={form}
                    type="toggle"
                    id="courseExcludeCompleted"
                    displayName="Exclude Completed"
                  />
                  <Field
                    form={form}
                    type="input"
                    id="courseName"
                    displayName="Has Course"
                    placeholder="Name ..."
                  />
                  <Field
                    form={form}
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
}

function Field({ form, id, displayName, type, placeholder }: formFieldProps) {
  if (!placeholder) placeholder = displayName + " ...";

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-wrap items-center">
            <FormLabel className="min-w-[40%] text-nowrap">
              {displayName}:{" "}
            </FormLabel>
            <FormControl>
              {getFieldType(type, id, placeholder!, field)}
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
}

function getFieldType(
  type: formFieldType,
  id: string,
  placeholder: string,
  field: ControllerRenderProps
) {
  const defaultAttr = {
    placeholder: placeholder!,
    onChangeCapture: (e: FormEvent) =>
      markChange(e.currentTarget as HTMLElement),
  };

  switch (type) {
    default:
    case "input":
      return <Input className="w-auto flex-grow" {...defaultAttr} {...field} />;
    case "textArea":
      return (
        <>
          <hr className="hidden w-full"></hr>
          <Textarea
            className="is-form-input ml-2 mt-2"
            {...defaultAttr}
            {...field}
          />
        </>
      );
    case "toggle":
      // annoyingly, checkbox does not make the native click event visible to us (unlike all other interactive
      // elements). See https://github.com/radix-ui/primitives/issues/734
      // the only solutions seem to be to either to convert it to its own pseudo form element (i think?)
      // or wrap it in a controller
      // its just a lot easier to .querySelector for the checkbox id though, so hence the below system
      return (
        <>
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={(c) => {
              const e = document.querySelector("#" + id);
              if (e) markChange(e as HTMLElement);
              field.onChange(c);
            }}
          />
        </>
      );
    case "dateRange":
      return (
        <>
          <DateRangeForm field={field} />
        </>
      );
  }
}
