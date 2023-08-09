/* eslint-disable @next/next/no-img-element */
import { Box, CircularProgress } from "@mui/material";
import ImageUpload from "../components/ImageUpload";
import ImageClassificationCard from "./ImageClassificationCard";
import { ImageInfo } from "./ImageInfo";
import Alert from '@mui/material/Alert';

type OnFilesChangedHandler = (files: File[]) => void;

type ObjectModelViewerProps = {
    onFilesChangedHandler: OnFilesChangedHandler;
    imageInfo: ImageInfo | undefined;
    processedImage: string | undefined;
};

const ObjectModelViewer = (props: ObjectModelViewerProps) => {
    const { imageInfo } = props;
    const filesChangedHandler = (files: File[]) => {
        if (props.onFilesChangedHandler) {
            props.onFilesChangedHandler(files);
        }
    };
   
    return (
        <Box
            display="flex"
            flexWrap={"wrap"}
            justifyContent={"center"}
            padding={"10px"}
        >
            <ImageUpload
                multiple={false}
                onFilesChanged={filesChangedHandler}
            ></ImageUpload>
            <Box style={{ flexBasis: "100%", height: "15px" }} />

            {props.imageInfo?.failedMsg && <Alert severity="error">{props.imageInfo.failedMsg}</Alert>}
            <Box style={{ flexBasis: "100%", height: "15px" }} />

            {imageInfo && (
                <ImageClassificationCard
                    key={imageInfo!.file.name}
                    file={imageInfo!.file}
                    imageData={props.processedImage}
                    imageHeight={props.processedImage ? "600px" : undefined}
                    timeMs={props.imageInfo?.endTime ? props.imageInfo.endTime - props.imageInfo.startTime : undefined}
                    processing={props.imageInfo?.endTime === undefined}
                />
            )}
        </Box>
    );
};

export default ObjectModelViewer;
