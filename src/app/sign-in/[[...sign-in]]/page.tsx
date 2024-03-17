import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: "#0f172A" } }} />
    </div>
  );
};

export default SignInPage;
