import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[6px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#2CBC63] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#2CBC63] text-white",
        secondary:
          "border-transparent bg-[#E0ECF0] text-[#023A51]",
        destructive:
          "border-transparent bg-[#CD201F] text-white",
        outline: "border-[#E8EBEF] text-[#023A51] bg-white",
        pill: "rounded-[32px] px-3 py-1 border-[#E8EBEF] bg-[#F8FAFC] text-[#023A51]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
