import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[8px] border border-[#E8EBEF] bg-[#F8FAFC] px-3.5 py-2.5 text-[14px] text-[#023A51] placeholder:text-[#93999F] transition-all duration-200 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBC63]/40 focus-visible:border-[#2CBC63] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
