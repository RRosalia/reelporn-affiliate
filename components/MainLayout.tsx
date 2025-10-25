'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that should show the sidebar
  const authenticatedRoutes = ['/dashboard', '/settings', '/referrals', '/payouts', '/reports', '/linkbuilder'];
  const shouldShowSidebar = authenticatedRoutes.some(route => pathname.startsWith(route));

  if (shouldShowSidebar) {
    return (
      <div className="flex min-h-screen bg-zinc-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
