import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
            {/* TODO: have differing menus based on user type? */}
            <div>{name}</div>
            <div>
              <b>Navigation</b>
              <p className="ml-2">Dashboard</p>
              <p className="ml-2">Challenge Portal</p>
            </div>
            <div>
              <b>Account Settings</b>
              <p className="ml-2">Sign Out</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <span className="ml-2 text-center font-sans text-4xl font-[375]">
        Training Platform
      </span>
    </div>
  );
}
