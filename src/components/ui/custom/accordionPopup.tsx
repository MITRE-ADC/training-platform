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
import { Input } from "../input";
import { Checkbox } from "../checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { ScrollArea } from "../scroll-area";

export interface AccordionData {
  name: string;
  children: AccordionChildData[];
}

// note that AccordionData can just be done recursively, but that doesn't play nice with how we render the data - via .map()
export interface AccordionChildData {
  name: string;
}

export default function AccordionPopup({
  title,
  children,
  data,
}: {
  title: string;
  children: JSX.Element;
  data: AccordionData[];
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[500px]">
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <p className="text-lg font-bold">{title}</p>
              <div className="relative my-1 w-3/4">
                <Input
                  placeholder="Search Courses"
                  className="flex h-8 justify-end rounded-full"
                />
                <span className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 transform"></span>
              </div>
              <ScrollArea className="main-outline mb-2 h-[500px] w-full">
                <Accordion
                  type="multiple"
                  defaultValue={data.map((d) => d.name)}
                >
                  {data.map((course, ind) => {
                    return (
                      <AccordionItem value={course.name} key={ind}>
                        <div className="mx-4 flex items-center gap-2">
                          <Checkbox></Checkbox>
                          <AccordionTrigger className="py-2">
                            {course.name}
                          </AccordionTrigger>
                        </div>
                        <AccordionContent className="flex flex-col gap-1">
                          {course.children.map((child, ind) => {
                            return (
                              <div className="ml-10 flex gap-2" key={ind}>
                                <Checkbox></Checkbox>
                                {child.name}
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
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
                <Close asChild>
                  <Button
                    variant="outline"
                    className="w-1/2 py-4 font-sans text-base"
                  >
                    Submit Changes
                  </Button>
                </Close>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
