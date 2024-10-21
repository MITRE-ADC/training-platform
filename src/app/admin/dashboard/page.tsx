import Navigation from "@/components/ui/custom/nav";
import { Separator } from "@/components/ui/separator";
import FilterForm from "./filterForm";
import EmployeeList from "./exployeeList";

function DashboardHeader({ name }: { name: string }) {
  return (
    <div>
      <p className="ml-1">{name}</p>
      <Separator orientation="horizontal" className="w-full bg-black" />
    </div>
  );
}

function DashboardFilter() {
  return (
    <div className="w-[30%]">
      <DashboardHeader name="Filter" />
      <div className="w-full p-2">
        <FilterForm />
      </div>
    </div>
  );
}

function DashboardList() {
  return (
    <div className="w-[30%]">
      <DashboardHeader name="Employees" />
      <EmployeeList />
    </div>
  );
}

function DashboardInfo() {
  return (
    <div className="w-[60%]">
      <DashboardHeader name="Name" />
    </div>
  );
}

export default function AdminDashBoard() {
  return (
    <div className="ml-4 mt-4">
      <Navigation name="Admin"></Navigation>
      <div className="mr-4 mt-4 flex justify-center">
        <div className="flex min-h-[90vh] w-[90%]">
          <Separator orientation="vertical" className="h-full bg-black" />
          <DashboardFilter />
          <Separator orientation="vertical" className="h-full bg-black" />
          <DashboardList />
          <Separator orientation="vertical" className="h-full bg-black" />
          <DashboardInfo />
          <Separator orientation="vertical" className="h-full bg-black" />
        </div>
      </div>
    </div>
  );
}
