import "sileo/styles.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/lib/theme";
import ThemedToaster from "@/components/ui/ThemedToaster";
import CookieConsent from "@/components/ui/CookieConsent";
import "../globals.css";
import { dmSans, bricolage, jsonLd } from "@/lib/site";

export { metadata } from "@/lib/site";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${bricolage.variable}`}>
        <head>
          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        </head>
        <body className="min-h-dvh flex flex-col">
          <script
            type="application/ld+json"
            
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ThemeProvider>
            {children}
            <ThemedToaster />
            <CookieConsent />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
