import Navigation from "@/components/ui/custom/nav";
import EmployeeList from "./employeeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { H2 } from "@/components/ui/custom/text";
import { AdvancedDashboardFilters } from "./advFilters";

export default function AdminDashBoard() {
  return (
    <div>
      <div className="m-6">
        <Navigation name="Admin"></Navigation>
      </div>
      <div className="h-8"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="main-outline flex h-full w-[95vw] justify-center">
          <Tabs
            defaultValue="employees"
            orientation="horizontal"
            className="flex h-full w-full flex-col"
          >
            <TabsList className="flex h-12 justify-between rounded-none bg-white p-0">
              <TabsTrigger
                value="employees"
                className="h-full w-full rounded-none border-b-[1px] border-black bg-secondary p-0 font-sans text-lg font-bold text-black data-[state=active]:border-b-0 data-[state=active]:bg-white"
              >
                Manage Employees
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="h-full w-full rounded-none border-b-[1px] border-l-[1px] border-black bg-secondary p-0 font-sans text-lg font-bold text-black data-[state=active]:border-b-0 data-[state=active]:bg-white"
              >
                Manage Courses
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow">
              <TabsContent value="employees" className="h-full">
                <div className="flex h-full w-full flex-col px-16 pb-14 pt-4">
                  <H2>Manage Employees</H2>
                  <div className="flex justify-between">
                    <div className="relative mb-6 mt-6 w-[500px]">
                      <Input
                        placeholder="Search Employees"
                        className="flex justify-end rounded-full py-2"
                      />
                      <span className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 transform"></span>
                    </div>
                    <div className="mb-2 flex flex-col justify-end">
                      <AdvancedDashboardFilters />
                    </div>
                  </div>
                  <div className="main-outline h-full">
                    <EmployeeList />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="course"></TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
