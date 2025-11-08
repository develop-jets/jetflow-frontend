import { ReactNode } from "react";

import "./globals.css"; // adjust path if needed

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}