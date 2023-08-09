import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

const AuthBoundary = (props: {
  children: ReactNode;
  loginPath?: string | null;
  dashboardPath?: string | null;
  requireAuth?: boolean | null;
  requireNonAuth?: boolean | null;
}) => {
    const router = useRouter();
    const authContext = useAuthContext();
    const token = authContext?.user?.token;
    const [doRender, setDoRender] = useState<boolean>(false);

    const requireNonAuth = props.requireNonAuth || false;
    const requireAuth = props.requireAuth  === true ? true : !props.requireNonAuth;
    const loginPath = props.loginPath ?? "/login";
    const dashboardPath = props.dashboardPath ?? "/";
    
    useEffect(() => {
        if (router.isReady) {
            setDoRender(true);
            if (requireAuth) {
                if (!token && router.pathname !== loginPath) {
                    console.log(`Token not found, redirecting to ${loginPath}.`);
                    router.push(loginPath);
                    setDoRender(false);
                }
                return;
            }
        
            if (requireNonAuth) {
                if (!token && router.pathname !== dashboardPath) {
                    router.push(dashboardPath);
                    setDoRender(false);
                }
                return;
            }
        }
    }, [authContext, token, dashboardPath, loginPath, requireAuth, requireNonAuth, router]);

    if (!doRender) {
        return <></>;
    }
    
    return <>{props.children}</>;
};

export default AuthBoundary;
