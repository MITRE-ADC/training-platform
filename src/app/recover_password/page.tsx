"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = () => {
    const errors = {
      email: false,
    };

    if (!email) errors.email = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    setErrorMessage("");
  };

  return (
    <div className="absolute w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <Card className="text-left mb-4">
        <CardHeader>
          <CardTitle>Recover Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.email ? 'border-2 border-rose-600' : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className='text-rose-600 mb-4'>{errorMessage}</p>}
          <br />
          <Button className='w-full' onClick={handleReset}>
            Get Code
          </Button>
        </CardContent>
      </Card>
      <p>
        Back to{" "}<a href="/signin"><b>sign in</b></a>
      </p>
    </div>
  );
}
