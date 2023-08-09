import { CircularProgress, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthContext } from "../src/auth/AuthContext";
import LoginIcon from '@mui/icons-material/Login';
import { Box } from "@mui/system";
import { LoggedUserType } from "../src/api/UserType";
import { Base64 } from "js-base64";


const Authorize = () => {
    const router = useRouter();
    const authContext = useAuthContext();

    useEffect(() => {
        if (router.isReady && router.query.data) {
            try {
                const data = Base64.decode(router.query.data as string);
                const {id, first_name, last_name, email, is_admin, is_active, token} = JSON.parse(data);
                console.log('is_admin', ('' + is_admin as string).toLowerCase());
                const user = {
                    id: id as string,
                    first_name: first_name as string,
                    last_name: last_name as string,
                    email: email as string,
                    is_admin: ('' + is_admin as string).toLowerCase() === "true",
                    is_active: ('' + is_active as string).toLowerCase() === "true",
                    token: token as string,
                }
                
                authContext!.setUser(user as LoggedUserType);
                router.replace("/");
            } catch(err) {
                console.log(err);
            }
        }
    }, [authContext, router]);

    if (!router.isReady) {
        return <CircularProgress />;
    }

    if (!router.query.noaccess && router.query.id) {
        return <><CircularProgress />You will be redirected soon</>;
    }

    return (
            <Box width="600px">
            <h1>Thank you for registering.</h1>
            <p>An account for you has been created on the system, but it is peding approval by the administrator.</p>
            <p>Please try again later or contact the Aministrator to check for status.</p>
            <Box style={{display: 'block', width: '250px', margin: '0 auto',}}>
            <Button style={{width: '100%',  marginTop: '30px'}} variant="contained" startIcon={<LoginIcon />} onClick={() => router.replace("/login")}>Back to login</Button>
            </Box>
            </Box>
        );

};

export default Authorize;