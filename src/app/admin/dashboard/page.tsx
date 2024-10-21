import Navigation from "@/components/ui/custom/nav";
import EmployeeList from "./exployeeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function AdminDashBoard() {
  return (
    <div>
      <div className="m-6">
        <Navigation name="Admin"></Navigation>
      </div>
      <div className="h-8"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="flex h-full w-[1711px] justify-center outline outline-1 outline-black">
          <Tabs
            defaultValue="employees"
            orientation="vertical"
            className="flex h-full w-full justify-between"
          >
            <TabsContent value="blank"></TabsContent>
            <TabsContent value="employees" className="w-[1642px] flex-grow">
              <div className="flex h-full w-full flex-col">
                <div className="ml-16 mt-12 font-sans text-3xl font-[375]">
                  Manage Employees
                </div>
                <div className="relative mb-6 ml-16 mt-6 w-[500px]">
                  <Input
                    placeholder="Search Employees"
                    className="flex justify-end rounded-full py-2"
                  />
                  <span className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 transform"></span>
                </div>
                <div className="mb-14 ml-16 mr-16 h-full outline outline-1 outline-black">
                  <EmployeeList />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="course"></TabsContent>
            <TabsList className="flex h-full w-[69px] justify-between rounded-none bg-white p-0 [writing-mode:vertical-lr]">
              <TabsTrigger
                value="blank"
                className="h-1/3 w-full rounded-none border-b-[1px] border-l-[1px] border-black p-0 font-sans text-lg font-bold text-black data-[state=active]:border-l-0"
              >
                Blank Tab
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="h-1/3 w-full rounded-none border-b-[1px] border-l-[1px] border-black p-0 font-sans text-lg font-bold text-black data-[state=active]:border-l-0"
              >
                Manage Employees
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="h-1/3 w-full rounded-none border-l-[1px] border-black p-0 font-sans text-lg font-bold text-black data-[state=active]:border-l-0"
              >
                Manage Courses
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
