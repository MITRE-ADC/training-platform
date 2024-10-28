import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/custom/tagSelector";
import {
  _ASSIGNMENTTAGS,
  _COURSETAGS,
  _ROLETAGS,
  _STATUSTAGS,
} from "./employeeDefinitions";

export function AdvancedDashboardFilters() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-base">
          Advanced Filters
          <i className="ri-arrow-down-s-fill ri-xl ml-1"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="h-[200px] w-[1000px] translate-x-[1px] translate-y-[3px] rounded-none border-black bg-secondary"
        align="end"
      >
        <div className="ml-8 flex h-full flex-col justify-around">
          <TagSelector title="Courses" tags={_COURSETAGS} />
          <TagSelector title="Assignments" tags={_ASSIGNMENTTAGS} />
          <TagSelector title="Roles" tags={_ROLETAGS} />
          <TagSelector title="Status" tags={_STATUSTAGS} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
