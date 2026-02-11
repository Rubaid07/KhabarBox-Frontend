"use client"

import { ReactElement, ReactNode, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface AnimatedListProps {
  className?: string
  children: React.ReactNode
  delay?: number
  maxItems?: number
}

export const AnimatedList = ({
  className,
  children,
  delay = 1000,
  maxItems = 4,
}: AnimatedListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
    }, delay)

    return () => clearInterval(interval)
  }, [childrenArray.length, delay])

  const itemsToShow = useMemo(() => {
    const items = []
    for (let i = 0; i < Math.min(maxItems, childrenArray.length); i++) {
      const index = (currentIndex + i) % childrenArray.length
      items.push({
        child: childrenArray[index],
        key: `${(childrenArray[index] as ReactElement).key}-${index}`,
      })
    }
    return items.reverse()
  }, [currentIndex, childrenArray, maxItems])

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {itemsToShow.map((item) => (
          <AnimatedListItem key={item.key}>
            {item.child}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function AnimatedListItem({ children }: { children: ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}