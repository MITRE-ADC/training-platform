"use client";

import EmployeeList, { analysisRequestInterface } from "./employeeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { H2, H3 } from "@/components/ui/custom/text";
import { AdvancedDashboardFilters } from "./advFilters";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ValidationCodesPopup from "./validation-codes-popup";

export default function AdminDashBoard() {
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const search = useRef<HTMLInputElement | null>(null);

  const [advFilterReq, setAdvFilterReq] = useState<
    analysisRequestInterface | undefined
  >(undefined);

  function handleSearch() {
    if (!search.current) return;

    setSearchFilter(search.current.value);
  }

  const onLogout = async () => {
    // ASK WILL TO IMPLEMENT A LOGOUT BUTTON HERE!
    try {
      const response = await axios.post("api/auth/signout");

      if (response.status === 200) {
        window.location.href = "/signin";
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
                className="data-[state=active]:tab-selected data-[state=inactive]:tab-unselected cursor-default"
              >
                <H3>Manage Employees</H3>
              </TabsTrigger>
            </TabsList>
            <div className="flex-grow border-[2px] border-highlight shadow-md">
              <TabsContent value="employees" className="h-full">
                <div className="flex h-full w-full flex-col px-16 py-12">
                  <div className="flex items-center justify-between">
                    <H2>Manage Employees</H2>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer text-lg">
                        <div className="flex items-center justify-start rounded-md border-[1px] border-highlight2 p-2 shadow-md">
                          <User className="mr-2 text-darkLight" size={16} />
                          <span className="text-sm text-darkLight">
                            Profile
                          </span>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-50 mr-20 rounded-md bg-white text-black shadow-md">
                        <DropdownMenuItem
                          onSelect={onLogout}
                          className="text-red-500 cursor-pointer"
                        >
                          <div className="flex items-center justify-start p-2">
                            Logout
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setIsDialogOpen(true)}
                          className="text-red-500 cursor-pointer"
                        >
                          <div className="flex items-center justify-start p-2">
                            See Validation Codes
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="outline" className="text-darkLight">
                            <i className="ri-information-line ri-1x"></i>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Instructions</DialogTitle>
                            <DialogDescription>
                              This is where you will assign courses to users and
                              monitor their progress.
                              <br />
                              <br />
                              You can assign a course to a user by clicking
                              &quot;Expand&quot;, then &quot;Modify
                              Courses&quot;. Assign the relevant courses to the
                              user, then click &quot;Submit Changes&quot;.
                              <br />
                              <br />
                              You can adjust the due dates for individual
                              courses by going back into the &quot;Modify
                              Courses&quot; menu and clicking the pencil icon
                              underneath each course name.
                              <br />
                              <br />
                              You can delete users by clicking the trash icon,
                              but this deletion is permanent and cannot be
                              undone.
                              <br />
                              <br />
                              When a user needs to reset their password, they
                              will ask you (the admin) for the validation code.
                              This can be found by clicking the
                              &quot;Profile&quot; button, then &quot;See
                              Validation Codes&quot;. Once the codes are
                              generated, they will expire in one day, and will
                              turn red once they are expired. Expired codes can
                              be cleared by clicking the &quot;Clear Expired
                              Codes&quot; button.
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
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
                  <div className="h-full">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="z-50 min-w-fit">
                        <DialogHeader>
                          <ValidationCodesPopup />
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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
