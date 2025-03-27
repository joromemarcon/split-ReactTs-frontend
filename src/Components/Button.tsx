import React, { ComponentProps } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonStyles = cva(["transition-colors"], {
  variants: {
    buttonVariant: {
      default: ["bg-secondary", "hover:bg-gray-500"],
      ghost: ["hover:bg-gray-100"],
      test: ["hover:bg-blue-100"],
    },
    size: {
      default: ["rounder", "p-2"],
      icon: [
        "rounded-full",
        "w-10",
        "h-10",
        "flex",
        "item-center",
        "justify-center",
        "p-2.5",
      ],
    },
  },
  defaultVariants: {
    buttonVariant: "default",
    size: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

/*
    - twMerge: takes custom classes(cva) and className classes
             : order of classes inside the function determines overriding order and merge with other added classes
             : in this case I want my custom buttonStyle class to execute first and override button. className is for additional styles 
*/
const Button = ({ buttonVariant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={twMerge(buttonStyles({ buttonVariant, size }), className)}
    />
  );
};

export default Button;
