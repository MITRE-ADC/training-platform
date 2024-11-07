import EmployeeList from "./employeeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { H2, H3 } from "@/components/ui/custom/text";
import { AdvancedDashboardFilters } from "./advFilters";
import Image from "next/image";

export default function AdminDashBoard() {
  return (
    <div>
      <div className="ml-[calc(43px+18px)] mt-[calc(26px+18px)]">
        <Image
          src="/mitre_logo.png"
          width="148"
          height="51"
          alt="Mitre Logo"
        ></Image>
      </div>
      <div className="h-[50px]"></div>
      <div className="flex h-[825px] w-screen items-center justify-center">
        <div className="flex h-full w-[85vw] justify-center">
          <Tabs
            defaultValue="employees"
            orientation="horizontal"
            className="flex h-full w-full flex-col"
          >
            <TabsList className="flex h-12 items-start justify-between gap-2 rounded-none bg-white p-0">
              <TabsTrigger
                value="employees"
                className="data-[state=active]:tab-selected data-[state=inactive]:tab-unselected"
              >
                <H3>Manage Employees</H3>
              </TabsTrigger>
              <TabsTrigger
                value="course"
                className="data-[state=active]:tab-selected data-[state=inactive]:tab-unselected"
              >
                <H3>Manage Courses</H3>
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow border-[2px] border-highlight shadow-md">
              <TabsContent value="employees" className="h-full">
                <div className="flex h-full w-full flex-col px-16 py-12">
                  <H2>Manage Employees</H2>
                  <div className="flex justify-between">
                    <div className="mb-5 mt-4 flex w-[405px] items-center justify-start rounded-md border-[1px] border-highlight2 shadow-md">
                      <span className="ri-search-line ri-lg ml-4 text-[#73737B]"></span>
                      <Input
                        placeholder="Search Employee"
                        className="border-0 py-2 font-inter focus-visible:ring-0"
                      />
                    </div>
                    <div className="mb-2 flex flex-col justify-end">
                      <AdvancedDashboardFilters />
                    </div>
                  </div>
                  <div className="h-full shadow-md">
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
