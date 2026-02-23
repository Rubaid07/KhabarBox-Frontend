"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  ShoppingCart,
  Search,
  User,
  LogOut,
  Loader2,
  Shield,
  ChefHat,
  X,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Roles } from "@/constants/roles";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/hooks/useCart";
import { SearchBar } from "../search/search-bar";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Meal", href: "/meals" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Orders", href: "/orders" },
];

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    let isMounted = true;
    const getSession = async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (isMounted) {
          if (!error && data?.user) {
            setUser(data.user as unknown as UserData);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };
    getSession();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null);
            toast.success("Logged out successfully");
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to logout");
          },
        },
      });
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getDashboardLink = (role: string) => {
    switch (role) {
      case Roles.admin:
        return "/admin/dashboard/overview";
      case Roles.provider:
        return "/provider/dashboard/overview";
      default:
        return "/orders";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case Roles.admin:
        return <Shield className="h-3 w-3 mr-1" />;
      case Roles.provider:
        return <ChefHat className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getRoleBadgeVariant = (
    role: string,
  ): "destructive" | "default" | "secondary" => {
    switch (role) {
      case Roles.admin:
        return "destructive";
      case Roles.provider:
        return "default";
      default:
        return "secondary";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchInputRef.current?.value;
    if (query?.trim()) {
      router.push(`/meals?search=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-3">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                disabled
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center">
                <div className="relative h-12 w-34 md:h-12 md:w-40">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white py-3 shadow-sm">
        <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side */}
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
                          className="object-contain object-left px-3"
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
                <div className="relative h-26 w-38">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
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

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 outline rounded-sm">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* ✅ Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                asChild={!!user && user.role === Roles.customer}
                disabled={!user || user.role !== Roles.customer}
                className="flex relative"
              >
                {user && user.role === Roles.customer ? (
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                ) : (
                  <span>
                    <ShoppingCart className="h-5 w-5 opacity-50" />
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="relative h-7 w-7 rounded-full cursor-pointer">
                      <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                        <AvatarImage
                          src={user.image || undefined}
                          alt={user.name}
                          className="rounded-full object-cover h-full w-full"
                        />
                        <AvatarFallback className="bg-orange-600 text-white text-xs font-medium rounded-full">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1 pt-1">
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="text-xs capitalize"
                        >
                          {getRoleIcon(user.role)} {user.role.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== Roles.customer && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={getDashboardLink(user.role)}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex px-3 border border-black hover:bg-gray-100"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild size="sm" className="px-3">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-x-0 top-0 z-[60] bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          {/* Back/Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-10 w-10"
            onClick={() => setIsSearchOpen(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search dishes, restaurants..."
                className="w-full pl-10 pr-4 h-10 bg-gray-100 border-0 focus-visible:ring-2 focus-visible:ring-orange-500 text-base"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Search Button */}
          <Button
            type="submit"
            size="sm"
            className="shrink-0 bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              const query = searchInputRef.current?.value;
              if (query?.trim()) {
                router.push(
                  `/meals?search=${encodeURIComponent(query.trim())}`,
                );
                setIsSearchOpen(false);
              }
            }}
          >
            Search
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="px-4 py-4 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Biryani",
              "Burger",
              "Pizza",
              "Kacchi",
              "Chinese",
              "Dessert",
              "Healthy",
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  router.push(`/meals?search=${encodeURIComponent(term)}`);
                  setIsSearchOpen(false);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}
