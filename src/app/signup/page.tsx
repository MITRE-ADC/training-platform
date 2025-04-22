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

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    //Checking the email
    const emailRegex = new RegExp(
      "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$"
    );
    const emailValid = emailRegex.test(email);

    if (!emailValid) {
      setErrorMessage("Invalid Email.");
      return;
    }

    // Checking the password
    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$");
    const passwordValid = passwordRegex.test(password);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords Do Not Match");

      setFieldErrors({ ...errors, password: true, confirmPassword: true });
    } else if (!passwordValid) {
      setErrorMessage(
        "Password Must Contain: At Least 8 Characters, 1 Uppercase, 1 Special Character."
      );
    } else {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: firstName + " " + lastName,
          email: email,
          password: password,
        }),
      });

      if (response.status != HttpStatusCode.Ok) {
        setErrorMessage("Signup Unsuccessful. Check Fields and Try Again.");
        return;
      } else {
        setErrorMessage("Signup Successful");

        await fetch("/api/webgoat/register", {
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

          DO NOT SET YOUR PASSWORD TO BE THE SAME AS YOUR ACTUAL MITRE PASSWORD
          <br />

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
