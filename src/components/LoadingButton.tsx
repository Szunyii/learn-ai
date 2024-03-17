import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";

type LoadingButtonProps = {
  loading: boolean;
} & ButtonProps;

const LoadingButton = ({ loading, children, ...props }: LoadingButtonProps) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
