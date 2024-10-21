"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
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

  const handleSignUp = () => {
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

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");

      setFieldErrors({ ...errors, password: true, confirmPassword: true });
    } else {
      setErrorMessage("");
    }
  };

  return (
    <div className="absolute w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <Card className="text-left mb-4">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.firstName ? 'border-2 border-rose-600' : ""}`}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.lastName ? 'border-2 border-rose-600' : ""}`}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.password ? 'border-2 border-rose-600' : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.confirmPassword ? 'border-2 border-rose-600' : ""}`}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className='text-rose-600 mb-4'>{errorMessage}</p>}

          <br />
          <Button className='w-full' onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardContent>
      </Card>
      <p>
        Already have an account?{" "}<a href="/signin"><b>Sign in!</b></a>
      </p>
    </div>
  );
}
