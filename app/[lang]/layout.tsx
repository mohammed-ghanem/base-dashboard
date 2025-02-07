import type { Metadata } from "next";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Import Mantine's core styles

import "./globals.css";
// import '@/utils/fontAwesome'; // Import the Font Awesome configuration
// import { AntdRegistry } from '@ant-design/nextjs-registry';





export const metadata: Metadata = {
  title: "build dashboard",
  // icons: {
  //   icon: "https://dashboard.sorooj.org/storage/26/favicon.ico", // Main favicon
  //   shortcut: "https://dashboard.sorooj.org/storage/26/favicon.ico",
  // }
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
        <MantineProvider
          defaultColorScheme="light" // Set default color scheme (light/dark)
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}