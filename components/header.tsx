
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, User, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!session && (
              <>
                <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </Link>
                <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                  Solutions
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard button */}
                <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>

                {/* Credits display */}
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">{session.user?.credits || 0} credits</span>
                </div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b z-50">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {session ? (
                <>
                  <Link
                    href="/dashboard/settings"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {session.user?.credits || 0} credits
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/features"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/features"
                    className="block px-3 py-2 text-base font-medium hover:bg-accent rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Solutions
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
