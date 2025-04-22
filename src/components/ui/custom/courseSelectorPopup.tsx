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
import { H2, H3, P, Small } from "./text";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DatePopup } from "./editPopup";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";

export interface CourseSelectorData {
  name: string;
  due?: Date;
  id: string;
  children: CourseSelectorChildData[];
}

export interface CourseSelectorChildData {
  name: string;
  id: string;
  courseId: string;
  webgoat: string;
}

function CourseSelectorAssignment({
  child,
  ind,
  assignedForm,
  notify,
}: {
  child: CourseSelectorChildData;
  ind: number;
  assignedForm: UseFormReturn;
  notify: (value: boolean, ind: number) => void;
}) {
  return (
    <FormField
      key={ind}
      control={assignedForm.control}
      name={child.id}
      render={() => {
        return (
          <FormItem className="ml-10 flex items-center gap-2">
            <FormControl>
              <Checkbox
                className="rounded-[3px]"
                checked={assignedForm.getValues(child.id) as boolean}
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
  assignedForm,
  dueForm,
}: {
  course: CourseSelectorData;
  ind: number;
  assignedForm: UseFormReturn;
  dueForm: UseFormReturn;
}) {
  const [dueDate, setDueDate] = useState<Date | undefined>(course.due);
  const [dueDateOpen, setDueDateOpen] = useState<boolean>(false);

  function notify(value: boolean, ind: number) {
    assignedForm.setValue(course.children[ind].id, value);

    if (value) {
      assignedForm.setValue(course.id, true);
    } else {
      let hasTrue = false;
      for (let i = 0; i < course.children.length; i++) {
        if (assignedForm.getValues(course.children[i].id)) {
          hasTrue = true;
          break;
        }
      }

      if (!hasTrue) assignedForm.setValue(course.id, false);
    }
  }

  return (
    <AccordionItem value={course.name} key={ind}>
      <FormField
        control={assignedForm.control}
        name={course.id}
        render={({ field }) => (
          <FormItem className="mx-4 flex items-center gap-2">
            <FormControl>
              <Checkbox
                className="rounded-[3px]"
                checked={field.value}
                onCheckedChange={(v) => {
                  course.children.forEach((c) =>
                    assignedForm.setValue(c.id, v as boolean)
                  );
                  field.onChange(v);
                }}
              ></Checkbox>
            </FormControl>
            <AccordionTrigger className="py-1">
              <P className="font-[500] leading-[20px]">{course.name}</P>
            </AccordionTrigger>
          </FormItem>
        )}
      />
      <AccordionContent className="flex flex-col gap-2">
        {dueDate ? (
          <Popover modal open={dueDateOpen} onOpenChange={setDueDateOpen}>
            <PopoverTrigger className="ml-10 flex items-center italic">
              <Small>
                Due: {dueDate.toLocaleDateString("en-US", { timeZone: "UTC" })}
              </Small>
              <i className="ri-edit-2-line ml-1 cursor-pointer text-darkBlue"></i>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                defaultMonth={dueDate}
                onSelect={(d) => {
                  if (!d) return;

                  setDueDate(d);
                  dueForm.setValue(course.id, d);
                  setDueDateOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        ) : (
          ""
        )}
        {course.children.map((child, ind) => (
          <CourseSelectorAssignment
            key={ind}
            child={child}
            ind={ind}
            assignedForm={assignedForm}
            notify={notify}
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
  handle: (
    assigned: Record<string, boolean>,
    due: Record<string, Date>
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  const assignedSchema = z.record(z.string(), z.boolean().default(false));
  const assignedForm = useForm<z.infer<typeof assignedSchema>>({
    resolver: zodResolver(assignedSchema),
  });

  const dueSchema = z.record(z.string(), z.date());
  const dueForm = useForm<z.infer<typeof dueSchema>>({
    resolver: zodResolver(dueSchema),
  });

  useEffect(() => {
    assignedForm.reset({});
    dueForm.reset({});

    defaultCourses.forEach((key) => {
      assignedForm.setValue(key, true);
    });
  }, [defaultCourses]);

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
              <Form {...assignedForm}>
                <form
                  onSubmit={assignedForm.handleSubmit((v) => {
                    handle(v, dueForm.getValues());
                    setOpen(false);
                  })}
                >
                  <ScrollArea className="mb-2 h-[500px] w-full rounded-md border-[1px] border-lightBlue pt-1">
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
                            assignedForm={assignedForm}
                            dueForm={dueForm}
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
