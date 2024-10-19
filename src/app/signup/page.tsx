"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./signup.module.css";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const handleSignUp = () => {
    const errors = {
      firstName: false,
      lastName: false,
      email: false,
      username: false,
      password: false,
      confirmPassword: false,
    };

    if (!firstName) errors.firstName = true;
    if (!lastName) errors.lastName = true;
    if (!email) errors.email = true;
    if (!username) errors.username = true;
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
    <div className={styles.centered}>
      <Card className={`${styles.accountCard} ${styles.marginBottom}`}>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.firstName ? styles.errorBorder : ""}`}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.lastName ? styles.errorBorder : ""}`}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.email ? styles.errorBorder : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
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
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.confirmPassword ? styles.errorBorder : ""}`}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <br />
          <Button className={styles.fullWidth} onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardContent>
      </Card>
      <p>
        Already have an account?
        <a href="/signin">
          <b>Sign in!</b>
        </a>
      </p>
    </div>
  );
}
