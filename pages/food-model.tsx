import React from "react";
import AuthBoundary from "../src/auth/AuthBoundary";
import AppNavBar from "../src/components/AppNavBar";
import FoodModelViewerContainer from "../src/models/FoodModelViewerContainer";

const FoodModel = () => {
    return (
        <>
            <AuthBoundary>
                <AppNavBar />
                <FoodModelViewerContainer />
            </AuthBoundary>
        </>
    );
};

export default FoodModel;
