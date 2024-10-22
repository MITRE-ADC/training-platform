import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Close } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../datePickerSingle";

function EditPopup({
  title,
  openBut,
  children,
}: {
  title: string;
  openBut?: JSX.Element | string;
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
      <Dialog>
        {but}
        <DialogContent className="w-[400px]">
          <VisuallyHidden.Root>
            <DialogHeader>{title}</DialogHeader>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <p className="text-lg font-bold">{title}</p>
              {children}
              <div className="flex justify-between">
                <Close asChild>
                  <Button
                    variant="ghost"
                    className="px-0 text-base hover:bg-white"
                  >
                    Cancel
                  </Button>
                </Close>
                <Close asChild>
                  <Button
                    variant="ghost"
                    className="px-0 text-base hover:bg-white"
                  >
                    Done
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

export function StringPopup({
  title,
  open,
}: {
  title: string;
  open?: JSX.Element | string;
}) {
  return (
    <EditPopup title={title} openBut={open}>
      <Input placeholder="New Value ..." />
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
