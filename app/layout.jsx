import { Geist_Mono, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./(root)/components/menu.css";
import Menu from "./(root)/components/Menu";
import Footer from "./(root)/components/Footer";

const switzerSans = localFont({
  src: [
    { path: "./fonts/Switzer-Variable.woff2", style: "normal" },
    { path: "./fonts/Switzer-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-switzer-sans",
  subsets: ["latin"],
});

const playfairSans = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "David Righi",
    template: "%s - David Righi",
  },
  description: "Photographer and Graphic Designer",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfairSans.variable} ${switzerSans.className} ${switzerSans.variable} ${geistMono.variable} antialiased overflow-x-hidden font-sans`}
      >
        {children}

        <Footer />
      </body>
    </html>
  );
}
