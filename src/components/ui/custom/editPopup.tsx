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
import { DatePicker } from "../datePickerSingle";
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

interface controlledOpen {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const stringSchema = z.object({
  value: z.string({
    message: "Please enter a value.",
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
        <DialogContent className="w-[400px]">
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <p className="text-lg font-bold">{title}</p>
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
                <FormControl>
                  <Input placeholder="New Value ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Close asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-white">
                Cancel
              </Button>
            </Close>
            <Button
              variant="ghost"
              className="px-0 text-base hover:bg-transparent"
              type="submit"
            >
              Done
            </Button>
          </div>
        </form>
      </Form>
    </EditPopup>
  );
}

export function DatePopup({
  title,
  open,
}: {
  title: string;
  open?: JSX.Element | string;
}) {
  return (
    <EditPopup title={title} openBut={open}>
      <DatePicker />
    </EditPopup>
  );
}
