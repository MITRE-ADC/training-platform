"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { HttpStatusCode } from "axios";
import React from "react";

type ValidationCode = {
  user_email: string;
  code: string;
  expiration_time: string;
};

const ValidationCodesPopup = () => {
  const [validationCodes, setValidationCodes] = React.useState<ValidationCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");

  const fetchCodes = async () => {
    try {
      const res = await fetch("/api/auth/reset_password/get_codes", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const data = await res.json();

      const parsedData: ValidationCode[] = data.data.map((code: any) => ({
        ...code,
        expirationTime: new Date(code.expirationTime).toString(),
      }));

      setValidationCodes(parsedData);
    } catch (err) {
      setErrorMessage("Failed to fetch codes.")
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const resp = await fetch("/api/auth/reset_password/clear_codes", {
      method: "DELETE"
    })

    if (resp.status != HttpStatusCode.Ok) {
      setErrorMessage("An error occurred while clearing the expired codes.")
    }

    setLoading(true);
    await fetchCodes();

  };

  React.useEffect(() => {
    fetchCodes();
  }, []);

  return (
    <div className="">
      <VisuallyHidden>
        <DialogDescription>Validation Codes</DialogDescription>
      </VisuallyHidden>
      <DialogTitle>Validation Codes</DialogTitle>
      <div className="mb-4 flex items-center justify-between">
        <DialogDescription className="text-sm text-darkLight">
          Provide these codes to users to reset their passwords.
        </DialogDescription>

        <Button
          className="rounded-md bg-slate-800 text-sm text-white hover:bg-slate-600"
          onClick={handleDelete}
        >
          Clear Expired Codes
        </Button>
      </div>

      {errorMessage && (
        <p className="text-customRed mb-4">{errorMessage}</p>
      )}

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
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              validationCodes.map((code, index) => {
                const isExpired = new Date(code.expiration_time) < new Date();

                const cellClass = `border-b border-gray-300 px-6 py-1 ${
                  isExpired ? "text-red": ""
                }`

                return (
                  <tr key={index}>
                    <td className={cellClass}>
                      {code.user_email}
                    </td>
                    <td className={cellClass}>
                      {code.code}
                    </td>
                    <td className={cellClass}>
                      {new Date(code.expiration_time).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
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