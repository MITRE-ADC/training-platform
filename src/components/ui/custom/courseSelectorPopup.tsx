import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Close, DialogDescription } from "@radix-ui/react-dialog";
import { Checkbox } from "../checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { ScrollArea } from "../scroll-area";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { H2, H3, P } from "./text";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export interface CourseSelectorData {
  name: string;
  id: string;
  children: CourseSelectorChildData[];
}

// note that CourseSelectorData can just be done recursively, but that doesn't play nice with how we render the data - via .map()
export interface CourseSelectorChildData {
  name: string;
  id: string;
  courseId: string;
  webgoat: string;
}

function CourseSelectorAssignment({
  child,
  ind,
  form,
  value,
  notify,
}: {
  child: CourseSelectorChildData;
  ind: number;
  form: UseFormReturn;
  value: boolean;
  notify: (value: boolean, ind: number) => void;
}) {
  return (
    <FormField
      key={ind}
      control={form.control}
      name={child.id}
      render={() => {
        return (
          <FormItem className="ml-10 flex items-center gap-2">
            <FormControl>
              <Checkbox
                className="rounded-[3px]"
                checked={value}
                onCheckedChange={(v) => notify(v as boolean, ind)}
              ></Checkbox>
            </FormControl>
            <P className="font-[500] leading-[20px]">{child.name}</P>
          </FormItem>
        );
      }}
    />
  );
}

function CourseSelectorAccordion({
  course,
  ind,
  form,
}: {
  course: CourseSelectorData;
  ind: number;
  form: UseFormReturn;
}) {
  const [childIsChecked, setChildIsChecked] = useState<boolean[]>(
    Array(course.children.length).fill(false)
  );

  function notify(value: boolean, ind: number) {
    const v = [...childIsChecked];
    v[ind] = value;
    setChildIsChecked(v);
    form.setValue(course.children[ind].id, value);

    if (value) {
      form.setValue(course.id, true);
    } else if (!v.includes(true)) {
      form.setValue(course.id, false);
    }
  }

  // ensure internal state is consistent with form
  course.children.map((child, ind) => {
    const f = form.getValues(child.id);
    if (f && f != childIsChecked[ind]) {
      notify(f as boolean, ind);
    }
  });

  return (
    <AccordionItem value={course.name} key={ind}>
      <FormField
        control={form.control}
        name={course.id}
        render={({ field }) => (
          <FormItem className="mx-4 flex items-center gap-2">
            <FormControl>
              <Checkbox
                className="rounded-[3px]"
                checked={field.value}
                onCheckedChange={(v) => {
                  setChildIsChecked(
                    Array(course.children.length).fill(v as boolean)
                  );
                  course.children.forEach((c) =>
                    form.setValue(c.id, v as boolean)
                  );
                  field.onChange(v);
                }}
              ></Checkbox>
            </FormControl>
            <AccordionTrigger className="py-2">
              <P className="font-[500] leading-[20px]">{course.name}</P>
            </AccordionTrigger>
          </FormItem>
        )}
      />
      <AccordionContent className="flex flex-col gap-2">
        {course.children.map((child, ind) => (
          <CourseSelectorAssignment
            key={ind}
            child={child}
            ind={ind}
            form={form}
            notify={notify}
            value={childIsChecked[ind]}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function CourseSelectorPopup({
  title,
  children,
  data,
  setData,
  defaultCourses,
  handle,
}: {
  title: string;
  children: JSX.Element;
  data: CourseSelectorData[];
  setData: Dispatch<SetStateAction<CourseSelectorData[]>>;
  defaultCourses: string[];
  handle: (r: Record<string, boolean>) => void;
}) {
  const [open, setOpen] = useState(false);

  const schema = z.record(z.string(), z.boolean().default(false));
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  defaultCourses.forEach((key) => {
    form.setValue(key, true);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[500px]">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Assign courses and assignments to employee
              </DialogDescription>
            </VisuallyHidden>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <H2>{title}</H2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => {
                    handle(v);
                    setOpen(false);
                  })}
                >
                  <ScrollArea className="mb-2 h-[500px] w-full rounded-md border-[1px] border-lightBlue">
                    <Accordion
                      type="multiple"
                      defaultValue={data.map((c) => c.name)}
                    >
                      {data.length != 0 ? (
                        data.map((course, ind) => (
                          <CourseSelectorAccordion
                            key={ind}
                            course={course}
                            ind={ind}
                            form={form}
                          />
                        ))
                      ) : (
                        <div className="flex w-full justify-center py-2">
                          <P>Loading...</P>
                        </div>
                      )}
                    </Accordion>
                  </ScrollArea>
                  <div className="flex w-full gap-2">
                    <Close asChild>
                      <Button
                        className="h-[40px] w-1/2 rounded-md bg-blue hover:bg-blue/80"
                        variant="secondary"
                      >
                        <P className="font-[600] text-white">Cancel</P>
                      </Button>
                    </Close>
                    <Button
                      className="h-[40px] w-1/2 rounded-md bg-navy hover:bg-navy/80"
                      variant="secondary"
                      type="submit"
                    >
                      <P className="font-[600] text-white">Submit Changes</P>
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
