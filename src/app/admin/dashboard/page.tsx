import Navigation from "@/components/ui/custom/nav";
import EmployeeList from "./exployeeList";

export default function AdminDashBoard() {
  return (
    <div>
      <div className="m-6">
        <Navigation name="Admin"></Navigation>
      </div>
      <div className="h-8"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="flex h-full w-[1711px] justify-center outline outline-1 outline-black">
          <div className="flex h-full w-full flex-col">
            <div className="ml-16 mt-12 font-sans text-3xl font-[375]">
              Manage Employees
            </div>
            <div className="h-16"></div>
            <div className="mb-14 ml-16 mr-16 h-full outline outline-1 outline-black">
              <EmployeeList />
            </div>
          </div>
          <div className="h-full w-[69px] outline outline-1 outline-black"></div>
        </div>
      </div>
    </div>
  );
}
