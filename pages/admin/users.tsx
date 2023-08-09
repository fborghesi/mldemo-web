import { Box } from "@mui/material";
import React from "react";
import AdminBoundary from "../../src/auth/AdminBoundary";
import AuthBoundary from "../../src/auth/AuthBoundary";
import AppNavBar from "../../src/components/AppNavBar";
import LoginFormContainer from "../../src/login/LoginFormContainer";
import UserTableContainer from "../../src/user/UserTableContainer";
import ErrorBoundary from "../../src/utils/ErrorBoundary";


const Users = () => {
    
    return (
        <ErrorBoundary>
            <AuthBoundary>
                <AdminBoundary>
                    <AppNavBar />
                    <Box display="flex" width="100%" height="100%">
                        <Box margin="auto">
                            <UserTableContainer />
                        </Box>
                    </Box>
                </AdminBoundary>
            </AuthBoundary>
        </ErrorBoundary>
    );
};

export default Users;
