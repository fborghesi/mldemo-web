import { Box } from "@mui/material";
import { MLDemoApi } from "../api/MLDemoApi";
import ArsModelViewer from "./ArsModelViewer";

const ArsModelViewerContainer = () => {
    const handleSpeechToText = (audioBlob: Blob): Promise<string> => {
        console.log("Invoking API");
        return MLDemoApi.speechToText(audioBlob);
    };
    
    return (
        <Box width={"60%"} margin={"0 auto"}>
            <h1>Audio Speech Recognition Model</h1>
            <ArsModelViewer speechToTextHandler={handleSpeechToText}/>
        </Box>
    );
};

export default ArsModelViewerContainer;
