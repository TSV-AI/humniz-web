
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl",
        premium: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl font-semibold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
        outline:
          "border-2 border-teal-500/20 bg-transparent hover:bg-teal-500/10 hover:border-teal-500/40 text-foreground shadow-lg hover:shadow-xl",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg",
        ghost: "hover:bg-teal-500/10 hover:text-foreground rounded-2xl",
        link: "text-teal-500 underline-offset-4 hover:underline p-0 h-auto font-medium",
        glass: "bg-white/5 backdrop-blur-lg border border-white/10 text-foreground hover:bg-white/10 shadow-lg",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-2xl px-6 text-sm",
        lg: "h-14 rounded-2xl px-10 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
