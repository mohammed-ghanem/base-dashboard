// app/[lang]/(auth)/layout.tsx
import { ReactNode } from "react";
import '../../../app/[lang]/globals.css'

type AuthLayoutProps = {
  children: ReactNode;
  params: { lang: string }; // Add params to access the locale
};

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  return (
    <html lang={params.lang} dir={params.lang === "ar" ? "rtl" : "ltr"}>
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}