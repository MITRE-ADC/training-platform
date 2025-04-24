"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async () => {
    const errors = {
      email: false,
    };

    if (!email) errors.email = true;
    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please enter your email.");
      return;
    }

    const response = await fetch("/api/auth/reset_password/check_email", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });

    if (response.status == HttpStatusCode.NotFound) {
      setErrorMessage("Email not found.");
      return;
    }
    if (response.status != HttpStatusCode.Ok) {
      setErrorMessage("Temporary Code Generation Failed.");
      return;
    }

    router.push("/reset_password");
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
      <Card className="mb-4 text-left">
        <CardHeader>
          <CardTitle>Recover Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.email ? "border-customRed border-2" : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  handleReset()
                }
              }}
              required
            />
          </div>
          {errorMessage && (
            <p className="text-customRed mb-4">{errorMessage}</p>
          )}
          <br />
          <Button className="w-full" onClick={handleReset}>
            Get Code
          </Button>
        </CardContent>
      </Card>
      <p>
        Back to{" "}
        <a href="/signin">
          <b>Sign In</b>
        </a>
      </p>
    </div>
  );
}
