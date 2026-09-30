import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBC63]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-[#023A51] text-white hover:bg-[#2CBC63] shadow-sm",
        destructive:
          "bg-[#CD201F] text-white hover:bg-[#b01c1b] shadow-sm",
        outline:
          "border border-[#E8EBEF] bg-white text-[#023A51] hover:bg-[#E0ECF0] hover:text-[#023A51]",
        secondary:
          "bg-[#E0ECF0] text-[#023A51] hover:bg-[#d0dfe6]",
        ghost:
          "text-[#33475B] hover:bg-[#E0ECF0]/50 hover:text-[#023A51]",
        link: "text-[#2CBC63] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 rounded-[8px]",
        sm: "h-9 rounded-[6px] px-4 text-xs",
        lg: "h-12 rounded-[10px] px-8 text-[15px]",
        xl: "h-14 rounded-[32px] px-8 text-[15px] font-bold",
        pill: "h-11 rounded-[32px] px-7 text-[15px] font-bold tracking-tight",
        icon: "h-10 w-10 rounded-[8px]",
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
