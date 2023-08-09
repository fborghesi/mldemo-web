import React from "react";
import AuthBoundary from "../src/auth/AuthBoundary";
import AppNavBar from "../src/components/AppNavBar";
import CarModelViewerContainer from "../src/models/CarModelViewerContainer";


const CarModel = () => {
    return (
        <AuthBoundary>
            <AppNavBar />
            <CarModelViewerContainer />
        </AuthBoundary>

    );
};

export default CarModel;
