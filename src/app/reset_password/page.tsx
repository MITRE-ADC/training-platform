"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HttpStatusCode } from "axios";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    code: false,
    password: false,
    confirmPassword: false,
  });

  const handleReset = async () => {
    const errors = {
      email: false,
      code: false,
      password: false,
      confirmPassword: false,
    };

    if (!email) errors.email = true;
    if (!code) errors.code = true;
    if (!password) errors.password = true;
    if (!confirmPassword) errors.confirmPassword = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$");
    const passwordValid = passwordRegex.test(password);

    if (password !== confirmPassword) {
      setErrorMessage("The two passwords do not match.");

      setFieldErrors({ ...errors, password: true, confirmPassword: true });
    } else if (!passwordValid) {
      setErrorMessage(
        "Password Must Contain: At Least 8 Characters, 1 Uppercase, 1 Special Character."
      );
    } else {
      const response = await fetch("/api/auth/reset_password/reset_password", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          code: code,
          password: password,
        }),
      });

      if (response.status == HttpStatusCode.BadRequest) {
        setErrorMessage("Incorrect code. Contact your admin to get the code.");
        return;
      }

      if (response.status == HttpStatusCode.UnprocessableEntity) {
        setErrorMessage(
          "The code is expired. Go back to the previous page to regenerate a new code."
        );
        return;
      }

      if (response.status == HttpStatusCode.InternalServerError) {
        setErrorMessage("Reset Password Failed");
        return;
      }

      router.push("signin");
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
      <Card className="mb-4 text-left">
        <Button
          variant={"ghost"}
          className="ml-2 mt-2"
          onClick={() => router.push("/recover_password")}
        >
          <ArrowLeft size={16} className="mr-4" />
          Back to Email Entry
        </Button>

        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.email ? "border-customRed border-2" : ""}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.code ? "border-customRed border-2" : ""}`}
              placeholder="Code (get this code from the system admin)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.password ? "border-customRed border-2" : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.confirmPassword ? "border-customRed border-2" : ""}`}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  handleReset()
                }
              }}
              required
            />
          </div>
          DO NOT SET YOUR PASSWORD TO BE THE SAME AS YOUR ACTUAL MITRE PASSWORD
          <br />
          {errorMessage && (
            <p className="text-customRed mb-4">{errorMessage}</p>
          )}
          <br />
          <Button className="w-full" onClick={handleReset}>
            Reset Password
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
