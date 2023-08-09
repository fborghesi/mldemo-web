import React from "react";
import AuthBoundary from "../src/auth/AuthBoundary";
import AppNavBar from "../src/components/AppNavBar";
import ObjectModelViewerContainer from "../src/models/ObjectModelViewerContainer";

const ObjectModel = () => {
    return (
        <>
            <AuthBoundary>
                <AppNavBar />
                <ObjectModelViewerContainer />
            </AuthBoundary>
        </>
    );
};

export default ObjectModel;
