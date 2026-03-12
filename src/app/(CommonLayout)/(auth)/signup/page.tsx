import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">

      <RegisterForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        By creating an account, you agree to our{" "}
        <button className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </button>{" "}
        and{" "}
        <button className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </button>
      </p>
    </div>
  );
}