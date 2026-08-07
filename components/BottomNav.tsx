"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { address } = useAccount();

  const isActive = (path: string) => {
    if (path === "/games") return pathname === "/" || pathname === "/games";
    return pathname === path;
  };

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <button
        className={isActive("/games") ? "active" : ""}
        onClick={() => router.push("/games")}
        aria-label="Games"
        aria-current={isActive("/games") ? "page" : undefined}
      >
        🎮
        <span>Games</span>
      </button>
      <button
        className={isActive("/tournament") ? "active" : ""}
        onClick={() => router.push("/tournament")}
        aria-label="Tournament"
        aria-current={isActive("/tournament") ? "page" : undefined}
      >
        🏆
        <span>Tournament</span>
      </button>
      <button
        className={pathname.startsWith("/profile") ? "active" : ""}
        onClick={() => router.push(address ? `/profile/${address}` : "/games")}
        aria-label="Your profile"
        aria-current={pathname.startsWith("/profile") ? "page" : undefined}
      >
        👤
        <span>You</span>
      </button>
      <a href="mailto:play@arcadia.uno" aria-label="Support">
        💬
        <span>Support</span>
      </a>
    </nav>
  );
}
