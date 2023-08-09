//import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/router";
import { Context, useCallback, useEffect } from "react";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { MLDemoApi } from "../api/MLDemoApi";
import { LoggedUserType } from "../api/UserType";

//import jwt_decode from "jwt-decode";

const USER_KEY = "user";
const SECURE_COOKIES_ENABLED = process.env.NEXT_PUBLIC_ENV !== 'dev';

export type AuthContextType = {
    user: LoggedUserType | null;
    setUser: (User: LoggedUserType) => void;
    unsetUser: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = (props: { children: ReactNode }) => {
    const [user, setUser] = useState<LoggedUserType | null>(null);
    const [isUserReady, setUserReady] = useState<boolean>(false);
    const router = useRouter();
    const [cookies, setCookie, deleteCookie] = useCookies(['user']);

    const logout = useCallback(() => {
        router.replace(
            `/logout?errorMessage=${encodeURIComponent(
                "Your session has expired, please log in again."
            )}`
        );
    }, [router]);

    const setAuthUser = useCallback(
        (newUser: LoggedUserType | null) => {
            if (user?.token != newUser?.token) {
                const options = {
                    secure: SECURE_COOKIES_ENABLED,
                };

                console.log(`setCookie(${newUser?.token}, ${JSON.stringify(options)}) -> `, newUser);
                setCookie(USER_KEY, JSON.stringify(newUser), options);
                setUser(newUser);
                MLDemoApi.setApiToken(newUser?.token, logout);
                setUserReady(true);
            }
        },
        [logout, user]
    );

    const unsetAuthUser = useCallback(() => {
        setUser(null);
        deleteCookie(USER_KEY);
        MLDemoApi.setApiToken(undefined, logout);
    }, [logout]);

    useEffect(() => {
        //const jsonUser = getCookie(USER_KEY)?.toString();
        const jsonUser = cookies[USER_KEY];
        console.log(`getCookie() ->`, jsonUser);
        if (jsonUser) {
            try {
                //const cookieUser = JSON.parse(jsonUser);
                //setAuthUser(cookieUser);
                setAuthUser(jsonUser);
            }
            catch(e) {
                console.log("Invalid user deserialization, removing cookie.");
            }
            
        }
        setUserReady(true);
    }, [setAuthUser]);

    const authContextMemo = useMemo(
        () => ({
            user,
            setUser: setAuthUser,
            unsetUser: unsetAuthUser,
        }),
        [setAuthUser, unsetAuthUser, user]
    );

    if (!isUserReady) {
        return <></>;
    }

    return (
        <AuthContext.Provider value={authContextMemo}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw Error("Attempted to read context value outside of provider");
    }

    return context;
};
