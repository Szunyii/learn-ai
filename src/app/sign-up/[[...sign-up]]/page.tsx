import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0f172A" } }} />
    </div>
  );
};

export default SignUpPage;
