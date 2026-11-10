"use client";

import { Toaster } from "sileo";
import { useTheme } from "@/lib/theme";

export default function ThemedToaster() {
  const { resolved } = useTheme();
  return <Toaster position="top-center" theme={resolved} />;
}
