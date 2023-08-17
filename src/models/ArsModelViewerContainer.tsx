import { Box } from "@mui/material";
import { MLDemoApi } from "../api/MLDemoApi";
import ArsModelViewer from "./ArsModelViewer";

const ArsModelViewerContainer = () => {    
    return (
        <Box width={"60%"} margin={"0 auto"}>
            <h1>Audio Speech Recognition Model</h1>
            <ArsModelViewer speechToTextHandler={MLDemoApi.arsReply}/>
        </Box>
    );
};

export default ArsModelViewerContainer;
