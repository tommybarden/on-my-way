import {EnvVarWarning} from "@/components/default/env-var-warning";
import HeaderAuth from "@/components/default/header-auth";
import {ThemeSwitcher} from "@/components/default/theme-switcher";
import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import {GeistSans} from "geist/font/sans";
import {ThemeProvider} from "next-themes";
import Image from "next/image";
import "./globals.css";
import {Viewport} from "next";
import RegisterServiceworker from "@/components/pwa/register-sw";
import EnablePushButton from "@/components/pwa/request-push";
import Link from "next/link";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const viewport: Viewport = {
    themeColor: "#000000",
    initialScale: 1,
    width: "device-width",
    maximumScale: 1,
    userScalable: false,
    minimumScale: 1,
};

export const metadata = {
    // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
    metadataBase: new URL(defaultUrl),
    title: "On my way",
    description: "Rescue service acknowledge app",
    creator: "Tommy Bärdén",
    authors: [{name: 'Tommy', url: 'https://dalkarby.com'}],
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
    appleWebApp: {
        title: 'On my way',
        statusBarStyle: 'black-translucent',
    },
    icons: {
        icon: '/icons/favicon.ico',
        shortcut: '/icons/favicon.ico',
        apple: [
            {url: '/icons/apple-touch-icon.png'},
            {url: '/icons/logo-152.png', sizes: '152x152', type: 'image/png'},
            {url: '/icons/logo-180.png', sizes: '180x180', type: 'image/png'},
            {url: '/icons/logo-192.png', sizes: '192x192', type: 'image/png'},
        ],
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/icons/logo-180.png',
        }
    },
};
/*
<meta name="application-name" content="PWA App" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="PWA App" />
<meta name="description" content="Best PWA App in the world" />
<meta name="format-detection" content="telephone=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="msapplication-config" content="/icons/browserconfig.xml" />
<meta name="msapplication-TileColor" content="#2B5797" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="theme-color" content="#000000" />

<link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
<link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
<link rel="manifest" href="/manifest.json" />
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

<meta name="twitter:card" content="summary" />
<meta name="twitter:url" content="https://yourdomain.com" />
<meta name="twitter:title" content="PWA App" />
<meta name="twitter:description" content="Best PWA App in the world" />
<meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
<meta name="twitter:creator" content="@DavidWShadow" />
<meta property="og:type" content="website" />
<meta property="og:title" content="PWA App" />
<meta property="og:description" content="Best PWA App in the world" />
<meta property="og:site_name" content="PWA App" />
<meta property="og:url" content="https://yourdomain.com" />
<meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />

<!-- apple splash screen images -->
<!--
<link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />
-->
*/


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="sv" className={GeistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >

            <div dangerouslySetInnerHTML={{
                __html: `<!-- 

                    ██  ██████  ███    ███  █████  ██       █████      ███████ ██████  ██   ██ 
                    ██ ██    ██ ████  ████ ██   ██ ██      ██   ██     ██      ██   ██ ██  ██  
                    ██ ██    ██ ██ ████ ██ ███████ ██      ███████     █████   ██████  █████   
               ██   ██ ██    ██ ██  ██  ██ ██   ██ ██      ██   ██     ██      ██   ██ ██  ██  
                █████   ██████  ██      ██ ██   ██ ███████ ██   ██     ██      ██████  ██   ██ 
                                                                                               
                    -->`
            }}/>

            <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col gap-2 items-center">
                    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                        <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
                            <div className="flex gap-5 items-center font-semibold">
                                <Link href="/profile">
                                    <Image
                                        className="p-2"
                                        src="/icons/logo-128.png"
                                        alt="OMW logo"
                                        width={64}
                                        height={64}
                                        priority
                                    />
                                </Link>
                            </div>
                            {!hasEnvVars ? <EnvVarWarning/> : <HeaderAuth/>}
                        </div>
                    </nav>
                    <div className="flex flex-col gap-2 w-full max-w-6xl p-4 justify-center items-center">
                        {children}
                        <RegisterServiceworker/>
                    </div>

                    <footer
                        className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">

                        <EnablePushButton/>
                        <p>
                            <a
                                href="http://www.jfbk.ax"
                                target="_blank"
                                className="font-bold hover:underline"
                                rel="noreferrer"
                            >
                                &copy; Jomala FBK
                            </a>
                        </p>
                        <ThemeSwitcher/>
                    </footer>
                </div>
            </main>
        </ThemeProvider>
        </body>
        </html>
    );
}
