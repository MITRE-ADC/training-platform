import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datePickerSingle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Close } from "@radix-ui/react-dialog";

export default function DatePopup({
  title,
  open,
}: {
  title: string;
  open: JSX.Element | string;
}) {
  return (
    <>
      <Dialog>
        {open instanceof String ? (
          <DialogTrigger>{open}</DialogTrigger>
        ) : (
          <DialogTrigger asChild>{open}</DialogTrigger>
        )}
        <DialogContent className="w-[400px]">
          <VisuallyHidden.Root>
            <DialogHeader>{title}</DialogHeader>
          </VisuallyHidden.Root>
          <DialogHeader>
            <div className="ml-4 mr-4 flex flex-col gap-2 font-sans">
              <p className="text-lg font-bold">{title}</p>
              <DatePicker />
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
