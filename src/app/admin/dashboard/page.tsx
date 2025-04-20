"use client";

import EmployeeList, { analysisRequestInterface } from "./employeeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { H2, H3 } from "@/components/ui/custom/text";
import { AdvancedDashboardFilters } from "./advFilters";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function AdminDashBoard() {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const search = useRef<HTMLInputElement | null>(null);

  const [advFilterReq, setAdvFilterReq] = useState<
    analysisRequestInterface | undefined
  >(undefined);

  function handleSearch() {
    if (!search.current) return;

    setSearchFilter(search.current.value);
  }


  const onLogout = async () => { // ASK WILL TO IMPLEMENT A LOGOUT BUTTON HERE! 
    try {
      const response = await axios.post("api/auth/signout");

      if (response.status === 200) {
        console.log("Successfully signed out");
        window.location.href = "/signin"; // Change as needed
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    

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
      <div className="flex h-full w-full items-center justify-center">
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
              {/*<TabsTrigger
                value="course"
                className="data-[state=active]:tab-selected data-[state=inactive]:tab-unselected"
              >
                <H3>Manage Courses</H3>
              </TabsTrigger>*/}
            </TabsList>
            <div className="flex-grow border-[2px] border-highlight shadow-md">
              <TabsContent value="employees" className="h-full">
                <div className="flex h-full w-full flex-col px-16 py-12">
                  <H2>Manage Employees</H2>
                  <div className="flex items-center justify-between">
                    <div className="mb-5 mt-4 flex w-[405px] items-center justify-start rounded-md border-[1px] border-highlight2 shadow-md">
                      <span className="ri-search-line ri-lg ml-4 text-[#73737B]"></span>
                      <Input
                        ref={search}
                        placeholder="Search Name or Email"
                        className="border-0 py-2 font-inter focus-visible:ring-0"
                        onBlur={handleSearch}
                        onKeyDown={(k) =>
                          k.key == "Enter" ? handleSearch() : null
                        }
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        className="text-darkLight"
                        onClick={() =>
                          dispatchEvent(
                            new Event("request_employee_list_reload")
                          )
                        }
                      >
                        <i className="ri-loop-right-line ri-1x"></i>
                      </Button>
                      <div className="flex flex-col justify-end">
                        <AdvancedDashboardFilters
                          handle={(c, a, s) => {
                            let filter: analysisRequestInterface | undefined =
                              undefined;

                            if (
                              !(c.length == 0 && a.length == 0 && s.length == 0)
                            ) {
                              filter = {
                                course_filter: '"' + c.join(",") + '"',
                                assignment_filter: '"' + a.join(",") + '"',
                                status_filter: '"' + s.join(",") + '"',
                              };
                            }

                            if (
                              filter?.assignment_filter !=
                                advFilterReq?.assignment_filter ||
                              filter?.course_filter !=
                                advFilterReq?.course_filter ||
                              filter?.status_filter !=
                                advFilterReq?.status_filter
                            ) {
                              setAdvFilterReq(filter);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="shadow-md" id="Employee-List-Table">
                    <EmployeeList
                      searchFilter={searchFilter}
                      setSearchFilter={setSearchFilter}
                      filter={advFilterReq}
                    />
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
