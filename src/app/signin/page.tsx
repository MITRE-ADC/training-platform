"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    const errors = {
      email: false,
      password: false,
    };

    if (!email) errors.email = true;
    if (!password) errors.password = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.status != HttpStatusCode.Ok) {
      setErrorMessage("Invalid Username or Password");
      return;
    } else {
      setErrorMessage("Login Successful! Loading...");
      const json = await response.json();
      console.log(json);
      if (json.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/challenges");
      }
      return;
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 transform text-center md:w-1/3">
      <Card className="mb-4 text-left">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
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
          {errorMessage && (
            <p className="text-customRed mb-4 text-lg">{errorMessage}</p>
          )}
          <div className="mt-1">
            <a className="text-lg font-bold" href="/recover_password">
              Forgot Password?
            </a>
          </div>
          <br />
          <Button className="h-12 w-full text-xl" onClick={handleSignIn}>
            Sign In
          </Button>
        </CardContent>
      </Card>
      <p>
        New User?{" "}
        <a href="/signup">
          <b>Sign up now!</b>
        </a>
      </p>
    </div>
  );
}
