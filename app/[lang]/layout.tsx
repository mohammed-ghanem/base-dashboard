// app/[lang]/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SideBar from "@/components/layouts/sideBar/SideBar";
import NavBar from "@/components/layouts/header/NavBar";
import Footer from "@/components/layouts/footer/Footer";

export const metadata: Metadata = {
  title: "build dashboard",
};

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

export default function RootLayout({ children, params }: Readonly<Props>) {
  return (
    <html lang={params.lang} dir={params.lang === "ar" ? "rtl" : "ltr"}>
      <body>
        <AntdRegistry>
          <div className="min-h-screen flex flex-col">
            <div className="flex flex-1">
              <SideBar />
              <div className="w-full flex flex-col">
                <NavBar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}