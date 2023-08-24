import { Box } from "@mui/material";
import { MLDemoApi } from "../api/MLDemoApi";
import FoodModelViewer from "./FoodModelViewer";

const ArsModelViewerContainer = () => {    
    return (
        <Box width={"60%"} margin={"0 auto"}>
            <h1>Food Recognition Model</h1>
            <FoodModelViewer />
        </Box>
    );
};

export default ArsModelViewerContainer;
