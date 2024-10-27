import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Close } from "@radix-ui/react-dialog";
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
import { useEffect, useState } from "react";

export interface CourseSelectorData {
  name: string;
  id: string;
  children: CourseSelectorChildData[];
}

// note that CourseSelectorData can just be done recursively, but that doesn't play nice with how we render the data - via .map()
export interface CourseSelectorChildData {
  name: string;
  id: string;
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
          <FormItem className="ml-10 flex gap-2">
            <FormControl>
              <Checkbox
                checked={value}
                onCheckedChange={(v) => notify(v as boolean, ind)}
              ></Checkbox>
            </FormControl>
            {child.name}
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
  const [childIsChecked, setChildIsChecked] = useState<boolean[]>([]);

  function notify(value: boolean, ind: number) {
    const v = [...childIsChecked];
    v[ind] = value;
    setChildIsChecked(v);
    form.setValue(course.children[ind].id, value);

    if (!value) {
      form.setValue(course.id, false);
    } else if (!v.includes(false)) {
      form.setValue(course.id, true);
    }
  }

  return (
    <AccordionItem value={course.name} key={ind}>
      <FormField
        control={form.control}
        name={course.id}
        render={({ field }) => (
          <FormItem className="mx-4 flex items-center gap-2">
            <FormControl>
              <Checkbox
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
            <AccordionTrigger className="py-2">{course.name}</AccordionTrigger>
          </FormItem>
        )}
      />
      <AccordionContent className="flex flex-col gap-1">
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
}: {
  title: string;
  children: JSX.Element;
  data: CourseSelectorData[];
}) {
  const schema = z.record(z.string(), z.boolean().default(false));

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState(false);

  // TODO: replace with auto inputting assignments!
  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[500px]">
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <p className="text-lg font-bold">{title}</p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => {
                    console.log(v);
                    setOpen(false);
                  })}
                >
                  <ScrollArea className="main-outline mb-2 h-[500px] w-full">
                    <Accordion
                      type="multiple"
                      defaultValue={data.map((d) => d.name)}
                    >
                      {data.map((course, ind) => (
                        <CourseSelectorAccordion
                          key={ind}
                          course={course}
                          ind={ind}
                          form={form}
                        />
                      ))}
                    </Accordion>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Close asChild>
                      <Button
                        variant="secondary"
                        className="w-1/2 py-4 font-sans text-base"
                      >
                        Cancel
                      </Button>
                    </Close>
                    <Button
                      variant="outline"
                      className="w-1/2 py-4 font-sans text-base"
                      type="submit"
                    >
                      Submit Changes
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
