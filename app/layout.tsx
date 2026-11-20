import type { Metadata, Viewport } from "next";
import "@fontsource/open-runde/latin-400.css";
import "@fontsource/open-runde/latin-500.css";
import "@fontsource/open-runde/latin-600.css";
import "@fontsource/open-runde/latin-700.css";
// Roboto is only used inside the Split Pay concept screens (downloaded on first use)
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "./globals.css";
import { CursorFollower } from "@/components/CursorFollower";

export const metadata: Metadata = {
  metadataBase: new URL("https://sudheer-design.vercel.app"),
  title: "Sudheer | UI/UX & Product Designer",
  description:
    "Sudheer Reddy Kancharla is a UI/UX & Product Designer crafting intuitive web and mobile products across fintech, commerce, CRM and design systems.",
  icons: { icon: "/assets/logo.svg" },
  openGraph: {
    title: "Sudheer | UI/UX & Product Designer",
    description: "I design experiences that convert.",
    images: ["/assets/payinstacard-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f0f0" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Applies the saved / system theme before paint so there's no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        {children}
        <CursorFollower />
      </body>
    </html>
  );
}
