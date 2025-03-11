"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleSignUp = async () => {
    // console.log("entered handleSignUp")
    const errors = {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    };

    if (!firstName) errors.firstName = true;
    if (!lastName) errors.lastName = true;
    if (!email) errors.email = true;
    if (!password) errors.password = true;
    if (!confirmPassword) errors.confirmPassword = true;

    setFieldErrors(errors);
    // console.log("passed setFieldErrors")

    if (Object.values(errors).includes(true)) {
      // setErrorMessage("Please fill out all required fields");
      return;
    }

    if (password !== confirmPassword) {
      // setErrorMessage("Passwords do not match");

      setFieldErrors({ ...errors, password: true, confirmPassword: true });
    } else {
      // console.log("starting sending");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: firstName + " " + lastName,
          email: email,
          password: password,
        }),
      });

      if (response.status != HttpStatusCode.Ok) {
        // console.log("shit's fucked up")
        setErrorMessage("Something Went Wrong");
        return;
      } else {
        // console.log("shit's not fucked up maybe?")
        setErrorMessage("SignUp Successful");
        // const data = new URLSearchParams();
        // data.append("name", firstName + " " + lastName);
        // data.append("password", password);
        // console.log(data);
        // const paramsString = "email="+email;
        // const data = new URLSearchParams(paramsString);
        // console.log("data:")
        // console.log(data);

        // const res = await fetch("/api/webgoat/register", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        //   body: data,
        // });
        const res = await fetch("/api/webgoat/register", {
          method: "POST",
          body: JSON.stringify({
            email: email,
          }),
        });
        router.push("/signin");
        return;
      }
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
      <Card className="mb-4 text-left">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.firstName ? "border-customRed border-2" : ""}`}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.lastName ? "border-customRed border-2" : ""}`}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.email ? "border-customRed border-2" : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.password ? "border-customRed border-2" : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 py-6 text-lg ${fieldErrors.confirmPassword ? "border-customRed0 border-2" : ""}`}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="text-customRed mb-4">{errorMessage}</p>
          )}

          <br />
          <Button className="h-12 w-full text-xl" onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardContent>
      </Card>
      <p>
        Already have an account?{" "}
        <a href="/signin">
          <b>Sign in!</b>
        </a>
      </p>
    </div>
  );
}
