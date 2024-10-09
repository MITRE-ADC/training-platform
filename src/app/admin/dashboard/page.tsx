import Navigation from "@/components/ui/custom/nav";
import { Separator } from "@/components/ui/separator";
import FilterForm from "./filterForm";

function DashboardHeader({ name }: { name: string }) {
  return (
    <div>
      <p className="ml-1">{name}</p>
      <Separator orientation="horizontal" className="w-full bg-black"/>
    </div>
  );
}

function DashboardFilter() {
  return (
    <div className="w-1/3">
      <DashboardHeader name="Filter"/>
      <div className="w-full p-2">
        <FilterForm/>
      </div>
    </div>
  );
}

function DashboardList() {
  return (
    <div className="w-1/3">
      <DashboardHeader name="Employees"/>
    </div>
  );
}

function DashboardInfo() {
  return (
    <div className="w-1/3">
      <DashboardHeader name="Name"/>
    </div>
  );
}

export default function AdminDashBoard() {
  return (
    <div className="mt-4 ml-4">
      <Navigation name="Admin"></Navigation>
      <div className="flex justify-center mr-4">
        <div className="w-4/5 flex min-h-[90vh]">
          <Separator orientation="vertical" className="h-full bg-black"/>
          <DashboardFilter/>
          <Separator orientation="vertical" className="h-full bg-black"/>
          <DashboardList/>
          <Separator orientation="vertical" className="h-full bg-black"/>
          <DashboardInfo/>
          <Separator orientation="vertical" className="h-full bg-black"/>
        </div>
      </div>
    </div>
  );
}
