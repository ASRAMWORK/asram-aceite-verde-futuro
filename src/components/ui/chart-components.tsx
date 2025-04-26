
"use client"

import React from "react"

export const ChartContainer = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export const ChartTooltip = ({ 
  children 
}: { 
  children: React.ReactNode
}) => {
  return (
    <div className="bg-background p-2 rounded-md shadow-md border">
      {children}
    </div>
  )
}

export const ChartTooltipContent = ({ 
  content 
}: { 
  content: {
    label?: string
    value?: string | number
    color?: string
  }[] 
}) => {
  return (
    <div className="flex flex-col gap-1 text-sm">
      {content.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.color && (
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="font-medium">{item.label}</span>
          {item.value && <span className="ml-auto">{item.value}</span>}
        </div>
      ))}
    </div>
  )
}
