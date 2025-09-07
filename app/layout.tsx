import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Monocraft from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from '@/app/providers/ThemeProvider';
import ThemeSwitcher from './components/ThemeSwitcher';
import Link from "next/link";
import {HiOutlineSun as SunIcon} from "react-icons/hi";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

const monocraft= Monocraft({
    src: "./Monocraft.ttf",
})

export const metadata: Metadata = {
    title: "Uni Notes",
    description: "waraidako inc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <header className={"flex w-full"}>
            <div className="justify-start m-2 opacity-0">
                <a href={"/piss"}>
                    <SunIcon className="h-8 w-8" />
                </a>
            </div>
            <Link href="/" className={`items-center left-0.5 m-2 ${monocraft.className} text-5xl logo`}>
                Uni Notes
            </Link>
            <div className="justify-end m-2">
                <Providers><ThemeSwitcher /></Providers>
            </div>
        </header>
        <Suspense>{children}</Suspense>
        <footer className={"flex w-full"}>
            <div className={"justify-start items-center m-2"}>
                <a href={"https://archive.onanists.ru"} className={"align-middle"}>
                    Прошлый семестр - переживи травмы ещё разочек
                </a>
            </div>
        </footer>
      </body>
    </html>
  );
}
