import * as React from "react"
import { cn } from "../../lib/utils"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, config, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, ChartProps>(
  ({ className, config, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("h-[300px] w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-background p-2 text-sm shadow-md",
      className
    )}
    {...props}
  />
))
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-1", className)}
    {...props}
  />
))
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } 