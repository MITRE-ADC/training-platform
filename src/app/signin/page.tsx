"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./signin.module.css";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = () => {
    const errors = {
      username: false,
      password: false,
    };

    if (!username) errors.username = true;
    if (!password) errors.password = true;

    setFieldErrors(errors);

    if (Object.values(errors).includes(true)) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    setErrorMessage("");
  };

  return (
    <div className={styles.centered}>
      <Card className={`${styles.accountCard} ${styles.marginBottom}`}>
        <CardHeader>
          <CardTitle>Recover Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.username ? styles.errorBorder : ""}`}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.password ? styles.errorBorder : ""}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <p>
            <a href="/recover_password">Forgot Password?</a>
          </p>
          <br />
          <Button className={styles.fullWidth} onClick={handleSignIn}>
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
