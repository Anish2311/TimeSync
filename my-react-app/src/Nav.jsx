"use client"

import React from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

export default function TopNavigation() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <NavigationMenu className="mx-auto max-w-7xl px-6">
        <NavigationMenuList className="flex h-14 items-center gap-6">
          {/* Brand */}
          <NavigationMenuItem>
            <span className="text-lg font-semibold tracking-tight">
              MyApp
            </span>
          </NavigationMenuItem>

          {/* Menu */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent className="rounded-xl p-4 shadow-lg">
              <NavigationMenuLink className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                Item One
              </NavigationMenuLink>
              <NavigationMenuLink className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
                Item Two
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className="text-sm font-medium hover:underline">
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink className="text-sm font-medium hover:underline">
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
