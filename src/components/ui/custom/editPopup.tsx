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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { Calendar } from "../calendar";
import { P } from "./text";

interface controlledOpen {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const stringSchema = z.object({
  value: z.string({
    message: "Please enter a value.",
  }),
});

const dateSchema = z.object({
  value: z.date({
    message: "Please select a date.",
  }),
});

function EditPopup({
  title,
  openBut,
  control,
  children,
}: {
  title: string;
  openBut?: JSX.Element | string;
  control?: controlledOpen;
  children: React.ReactNode;
}) {
  let but: JSX.Element;
  if (openBut) {
    if (openBut instanceof String)
      but = <DialogTrigger>{openBut}</DialogTrigger>;
    else but = <DialogTrigger asChild>{openBut}</DialogTrigger>;
  } else {
    but = (
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-6 px-3 py-0 font-semibold">
          Edit
        </Button>
      </DialogTrigger>
    );
  }

  return (
    <>
      <Dialog
        open={control ? control.open : undefined}
        onOpenChange={control ? control.setOpen : undefined}
      >
        {but}
        <DialogContent className="w-[340px]" aria-describedby="editID">
          <VisuallyHidden.Root>
            <DialogTitle id="editID">{title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="mx-1 flex flex-col gap-2 font-sans">
              <P className="font-[600]">{title}</P>
              {children}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function StringPopup({
  title,
  openBut,
  handle,
}: {
  title: string;
  openBut?: JSX.Element | string;
  handle?: (v: z.infer<typeof stringSchema>) => void;
}) {
  const form = useForm<z.infer<typeof stringSchema>>({
    resolver: zodResolver(stringSchema),
    defaultValues: {
      value: "",
    },
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    form.reset({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <EditPopup
      title={title}
      openBut={openBut}
      control={{ open: open, setOpen: setOpen }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            if (handle) handle(v);
            else console.log(v);
            setOpen(false);
          })}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl className="rounded-md shadow-md">
                  <Input placeholder="New Value ..." className="py-2 border border-highlight focus-visible:ring-0 font-inter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full mt-4 gap-2">
            <Button
              variant="secondary"
              className="flex-grow bg-navy rounded-md py-[18px] hover:bg-navy/80"
              type="submit"
            >
              <P className="text-white font-[600]">Update</P>
            </Button>
            <Close asChild>
              <Button variant="secondary" className="flex-grow bg-lightBlue rounded-md py-[18px] hover:bg-lightBlue/80">
              <P className="text-white font-[600]">Close</P>
              </Button>
            </Close>
          </div>
        </form>
      </Form>
    </EditPopup>
  );
}

export function DatePopup({
  title,
  openBut,
  handle,
}: {
  title: string;
  openBut?: JSX.Element | string;
  handle?: (v: z.infer<typeof dateSchema>) => void;
}) {
  const form = useForm<z.infer<typeof dateSchema>>({
    resolver: zodResolver(dateSchema),
  });

  const [open, setOpen] = useState(false);

  return (
    <EditPopup
      title={title}
      openBut={openBut}
      control={{ open: open, setOpen: setOpen }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            if (handle) handle(v);
            else console.log(v);
            setOpen(false);
          })}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover modal={true}>
                    <PopoverTrigger asChild className="text-base">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-8 w-full justify-start px-0 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <i className="ri-calendar-line ml-2 mr-2"></i>
                        {field.value ? (
                          format(field.value, "LLL dd")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full mt-4 gap-2">
            <Button
              variant="secondary"
              className="flex-grow bg-navy rounded-md py-[18px] hover:bg-navy/80"
              type="submit"
            >
              <P className="text-white font-[600]">Update</P>
            </Button>
            <Close asChild>
              <Button variant="secondary" className="flex-grow bg-lightBlue rounded-md py-[18px] hover:bg-lightBlue/80">
              <P className="text-white font-[600]">Close</P>
              </Button>
            </Close>
          </div>
        </form>
      </Form>
    </EditPopup>
  );
}
