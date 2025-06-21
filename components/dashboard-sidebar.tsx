
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  PenTool, 
  Settings, 
  CreditCard, 
  Menu,
  X,
  BarChart3,
  LogOut,
  Plus
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Humanizer',
    href: '/dashboard',
    icon: PenTool,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-20 left-4 z-40"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Main Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-teal-500/10 text-teal-500 border border-teal-500/20 dark:bg-accent dark:text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t space-y-4">
            <Button
              variant="default"
              size="lg"
              className="w-full justify-center font-semibold"
              asChild
            >
              <Link href="/dashboard/billing" onClick={() => setMobileOpen(false)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Credits
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              size="default"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
