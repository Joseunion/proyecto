"use client";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import Script from "next/script";
import NextAuthProvider from "@/context/NextAuthProvider";
import { EasyToastContainer } from "easy-toast-react-bootstrap";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//     title: "Reminds me of",
//     description: "La aplicación para hacer review y decir a que te recuerda",
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Reminds me of</title>
                <meta name="description" content="La aplicación para hacer review y decir a que te recuerda"></meta>
            </head>
            <Script
                src="https://kit.fontawesome.com/3075dfbe5b.js"
                crossOrigin="anonymous"
            ></Script>
            <NextAuthProvider>
                <body className={inter.className}>
                    <EasyToastContainer
                        position="top-end"
                        className="p-3 position-fixed"
                    >
                        {children}
                    </EasyToastContainer>
                </body>
            </NextAuthProvider>
        </html>
    );
}
