import { Box } from "@mui/material";
import React from "react";
import AuthBoundary from "../src/auth/AuthBoundary";
import LoginFormContainer from "../src/login/LoginFormContainer";
import ErrorBoundary from "../src/utils/ErrorBoundary";


const Login = () => {
    
    return (
        <ErrorBoundary>
            <AuthBoundary>
                <Box display="flex" width="100%" height="100%">
                    <Box margin="auto">
                        <LoginFormContainer />
                    </Box>
                </Box>
            </AuthBoundary>
        </ErrorBoundary>
    );
};

export default Login;
