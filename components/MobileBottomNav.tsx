"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  const isActive = (path: string) => {
    if (path === '/games') return pathname === '/' || pathname === '/games';
    return pathname === path;
  };

  return (
    <div className="mobile-bottom-nav">
      <button
        className={isActive('/games') ? 'active' : ''}
        onClick={() => router.push('/games')}
      >
        🎮
        <span>Games</span>
      </button>
      <button
        className={isActive('/tournament') ? 'active' : ''}
        onClick={() => router.push('/tournament')}
      >
        🏆
        <span>Tournament</span>
      </button>
      <button
        className={pathname.startsWith('/profile') ? 'active' : ''}
        onClick={() => address ? router.push(`/profile/${address}`) : router.push('/games')}
      >
        👤
        <span>You</span>
      </button>
    </div>
  );
}
