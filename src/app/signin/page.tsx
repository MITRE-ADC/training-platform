'use client';
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//import { signIn } from "@/db/auth";
// import {signIn } from "next-auth/react"
//import { db } from "@/db/index";
//import { userEmailExists } from "@/db/queries"
import { HttpStatusCode } from "axios";



export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = () => {
    const errors = {
      email: false,
      password: false,
    };

    if (!email) errors.email = true;
    if (!password) errors.password = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    // signIn("credentials", {email: email, password: password})

    const response = fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });

    response.then(function(res) {
      if (res.status != HttpStatusCode.Ok) {
        setErrorMessage("SOMETHING WENT WRONG bro");
        return;
      } else {
        setErrorMessage("SUCCESSS bro");
        return;
      }
      
      
    })

    

  };

  return (
    <div className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center">
      <Card className="mb-4 text-left">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.email ? "border-2 border-rose-600" : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`mb-4 ${fieldErrors.password ? "border-2 border-rose-600" : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="mb-4 text-rose-600">{errorMessage}</p>}
          <p>
            <a href="/recover_password">Forgot Password?</a>
          </p>
          <br />
          <Button className="w-full" onClick={handleSignIn}>
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
