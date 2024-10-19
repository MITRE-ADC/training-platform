"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./signin.module.css";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = () => {
    const errors = {
      email: false,
    };

    if (!email) errors.email = true;

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
              className={`${styles.marginBottom} ${fieldErrors.email ? styles.errorBorder : ""}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <br />
          <Button className={styles.fullWidth} onClick={handleReset}>
            Get Code
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
