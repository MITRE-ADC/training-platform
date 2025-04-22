import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { H1 } from "./text";

export default function Navigation({ name }: { name: string }) {
  return (
    <div className="flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <i className="ri-menu-fill ri-2x"></i>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex h-full w-full flex-col gap-4">
            <div>{name}</div>
            <div>
              <b>Navigation</b>
              <a href="/admin/dashboard">
                <p className="ml-2">Dashboard</p>
              </a>
              <a href="/challenges">
                <p className="ml-2">Challenge Portal</p>
              </a>
            </div>
            <div>
              <b>Account Settings</b>
              <p className="ml-2">Sign Out</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <H1>Training Platform</H1>
    </div>
  );
}
