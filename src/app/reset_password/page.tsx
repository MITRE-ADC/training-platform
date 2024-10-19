"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./signup.module.css";

export default function SignUpPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    code: false,
    password: false,
    confirmPassword: false,
  });

  const handleReset = () => {
    const errors = {
      code: false,
      password: false,
      confirmPassword: false,
    };

    if (!code) errors.code = true;
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
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              className={`${styles.marginBottom} ${fieldErrors.code ? styles.errorBorder : ""}`}
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
          <Button className={styles.fullWidth} onClick={handleReset}>
            Reset Password
          </Button>
        </CardContent>
      </Card>
      <p>
        Back to{" "}
        <a href="/signin">
          <b>sign in</b>
        </a>
      </p>
    </div>
  );
}
