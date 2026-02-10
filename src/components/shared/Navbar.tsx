"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingCart, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Meal", href: "/meals" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Offers", href: "/offers" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-3">
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetTitle className="hidden">Mobile Menu</SheetTitle>

                <div className="flex flex-col gap-6 pt-6 px-2">
                  
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-52">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain object-left"
                        priority
                      />
                    </div>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-34 md:h-12 md:w-40">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain object-left md:object-center"
                  priority
                />
              </div>
            </Link>

            
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>

          
          <div className="hidden md:flex flex-1 max-w-md mx-4 outline rounded-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search restaurants or dishes..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          
          <div className="flex items-center gap-2">
            
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="px-3 border border-black hover:bg-gray-100">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="px-3">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}