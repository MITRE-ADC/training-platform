"use client";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";

type ValidationCode = {
  email: string;
  code: string;
  expirationTime: Date;
};

const ValidationCodesPopup = () => {
  const [validationCodes, setValidationCodes] = React.useState<
    ValidationCode[]
  >([
    {
      email: "user1@example.com",
      code: "ABC123",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user2@example.com",
      code: "DEF456",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user3@example.com",
      code: "GHI789",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user4@example.com",
      code: "JKL012",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user5@example.com",
      code: "MNO345",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user6@example.com",
      code: "PQR678",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user7@example.com",
      code: "STU901",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user8@example.com",
      code: "VWX234",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user9@example.com",
      code: "YZA567",
      expirationTime: new Date(Date.now() + 3600000),
    },
    {
      email: "user10@example.com",
      code: "BCD890",
      expirationTime: new Date(Date.now() + 3600000),
    },
  ]);

  return (
    <div className="">
      <VisuallyHidden>
        <DialogDescription>Validation Codes</DialogDescription>
      </VisuallyHidden>
      <DialogTitle>Validation Codes</DialogTitle>
      <div className="mb-4 flex items-center justify-between">
        <DialogDescription className="text-sm text-darkLight">
          Provide these codes to users to reset their passwords
        </DialogDescription>

        <Button
          className="rounded-md bg-slate-800 text-sm text-white hover:bg-slate-600"
          onClick={() => {}}
        >
          Clear Expired Codes
        </Button>
      </div>

      <div className="my-2 overflow-hidden rounded-md border border-gray-300">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-b border-gray-300 px-6 py-1">Email</th>
              <th className="border-b border-gray-300 px-6 py-1">Code</th>
              <th className="border-b border-gray-300 px-6 py-1">
                Expiration Time
              </th>
            </tr>
          </thead>
          <tbody className="text-base text-darkLight">
            {validationCodes.map((code, index) => (
              <tr key={index}>
                <td className="border-b border-gray-300 px-6 py-1">
                  {code.email}
                </td>
                <td className="border-b border-gray-300 px-6 py-1">
                  {code.code}
                </td>
                <td className="border-b border-gray-300 px-6 py-1">
                  {code.expirationTime.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-2">
        <DialogClose asChild>
          <Button className="w-full rounded-md bg-slate-800 px-16 py-5 text-sm text-white hover:bg-slate-600">
            Close
          </Button>
        </DialogClose>
      </div>
    </div>
  );
};

export default ValidationCodesPopup;
