import type { Metadata } from "next";
import "./globals.css";
// import '@/utils/fontAwesome'; // Import the Font Awesome configuration
import { AntdRegistry } from '@ant-design/nextjs-registry';
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

export default async function RootLayout({
  children,
  params,
}: Readonly<Props>) {


  return (
    <html lang={params.lang} dir={params.lang === "ar" ? "rtl" : 'ltr'}>
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <SideBar />
            <div className="w-full flex flex-col">
              {/* Navbar */}
              <NavBar />
              {/* Children - flex-1 ensures it takes up remaining space */}
              <main className="flex-1">
                <AntdRegistry>{children}</AntdRegistry>
              </main>
              {/* Footer - stays at the bottom */}
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}