'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea";

const dashboardFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(), // dont validate for strict email (e.g. .email())) since we want to allow for searching for substr of email
  position: z.string().optional(), // TODO: consider making this a dropdown value?
});

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
  let label: HTMLElement | null = null;

  if (ele.tagName != 'LABEL') {
    if (!ele.parentElement) {
      console.warn("Attempting to mark form input as changed, but input does not have a parent element.");
      return;
    }

    const n = ele.parentElement.childElementCount!;

    // .querySelector and .contains search recursively; we only want direct children
    for (let i = 0; i < n; i++) {
      const c = ele.parentElement.children[i]!;

      if (c.tagName == 'LABEL') {
        label = c as HTMLElement;
        break;
      }
    }

    if (!label) label = ele.querySelector('label');
  } else label = ele;

  if (!label) {
    console.warn("Attempting to mark form input as changed, but there is no associated label.");
    return;
  }

  if (!label.textContent) return;

  // now mark change
  if (hasChange && !label.textContent.startsWith('* ')) {
    changedForms.push(ele);
    label.textContent = '* ' + label.textContent;
  } else label.textContent = label.textContent.replace('*', '')!;
}

export default function FilterForm() {
  const form = useForm<z.infer<typeof dashboardFilterSchema>>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      name: "",
      email: "",
      position: "",
    },
  });

  function onSubmit(values: z.infer<typeof dashboardFilterSchema>) {
    changedForms.forEach(e => markChange(e, false));
    changedForms.length = 0;

    console.log(values)
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <Button variant="secondary">
              <i className="ri-loop-left-line mr-2"></i>
              Reset
            </Button>
            <Button variant="secondary" type="submit">
              <i className="ri-edit-line mr-2"></i>
              Apply
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full" defaultValue="userInfo">
            <AccordionItem value="userInfo">
              <AccordionTrigger>User Information</AccordionTrigger>
              <AccordionContent>
                <div className="ml-4 flex gap-2 flex-col">
                  <Field form={form} id="name" displayName="Name"/>
                  <Field form={form} id="email" displayName="Email"/>
                  <Field form={form} id="position" displayName="Position"/>
                  <Field form={form} id="notes" displayName="Notes">
                    <>
                      <hr className="w-full"></hr>
                      <Textarea placeholder={"Notes ..."}
                                onChange={e => markChange(e.currentTarget as HTMLElement)}/>
                    </>
                  </Field>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>    
        </form>
      </Form>
    </>
  );
}

interface FormFieldProps {
  form: UseFormReturn;
  id: string;
  displayName: string;
  placeholder?: string;
  children?: React.ReactNode;
}

function Field({ form, id, displayName, placeholder, children }: FormFieldProps) {
  if (!placeholder) placeholder = displayName + ' ...';

  return (
    <FormField control={form.control} name={id} render={({ field }) => (
      <FormItem>
        <div className="flex items-center flex-wrap">
          <FormLabel className="text-nowrap min-w-[20%]">{displayName}: </FormLabel>
          <FormControl>
            {!children
              ? <Input className="w-auto flex-grow" placeholder={placeholder!}
                       onChangeCapture={e => markChange(e.currentTarget as HTMLElement)} {...field}/>
              : children}
          </FormControl>
        </div>
      </FormItem>
    )}/>
  );
}