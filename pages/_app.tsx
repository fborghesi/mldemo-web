import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CookiesProvider } from "react-cookie";
import { AuthContextProvider } from "../src/auth/AuthContext";
import ErrorBoundary from "../src/utils/ErrorBoundary";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <CookiesProvider>
                <AuthContextProvider>
                    <Component {...pageProps} />
                </AuthContextProvider>
            </CookiesProvider>
        </ErrorBoundary>
    );
}

export default MyApp;
