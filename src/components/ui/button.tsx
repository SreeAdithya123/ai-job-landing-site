
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-glow shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
        outline:
          "border border-input bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-accent-foreground shadow-md",
        secondary:
          "bg-white/60 backdrop-blur-md text-foreground hover:bg-white/80 shadow-md border border-white/20",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-glow-accent",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
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
