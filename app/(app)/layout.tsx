import "sileo/styles.css";
import { headers } from "next/headers";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import ThemedToaster from "@/components/ui/ThemedToaster";
import "../globals.css";
import { dmSans, bricolage, jsonLd } from "@/lib/site";

export { metadata } from "@/lib/site";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${bricolage.variable}`}>
        <head>
          <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        </head>
        <body className="min-h-dvh flex flex-col">
          <script
            type="application/ld+json"
            nonce={nonce}
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ThemeProvider>
            {children}
            <ThemedToaster />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
