import React from "react";
import AuthBoundary from "../src/auth/AuthBoundary";
import AppNavBar from "../src/components/AppNavBar";
import ArsModelViewerContainer from "../src/models/ArsModelViewerContainer";

const ArsModel = () => {
    return (
        <>
            <AuthBoundary>
                <AppNavBar />
                <ArsModelViewerContainer />
            </AuthBoundary>
        </>
    );
};

export default ArsModel;
