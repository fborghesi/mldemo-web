import { useAuthContext } from "../src/auth/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();
    const authContext = useAuthContext();
    

    useEffect(() => {
        if (router.isReady) {
            authContext.unsetUser();

            let url = "/login";
            const errorMessage = router.query?.errorMessage as string;
            if (errorMessage) {
                url += `?errorMessage=${encodeURIComponent(errorMessage)}`;
            }
            router.push(url);  
        }
    }, [router, router.query, authContext]);
    return <></>;
}
