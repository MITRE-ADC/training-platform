import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from './signin.module.css';

export default function SignInPage() {
    return (
      <div className={styles.centered}>
        <Card className={`${styles.accountCard} ${styles.marginBottom}`}>
            <CardHeader>
                <CardTitle>Log In</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex gap-4">
                <Input className={styles.marginBottom} placeholder="Username" />
            </div>
            <div className="flex gap-4">
                <Input className={styles.marginBottom} type="password" placeholder="Password" />
            </div>
            <p><a href="">Forgot Password?</a></p>
            <br></br>
            <Button className={styles.fullWidth}>Sign In</Button>
            </CardContent>
        </Card>
        <p>New User? <a href=""><b>Sign up now!</b></a></p>
      </div>
    );
}