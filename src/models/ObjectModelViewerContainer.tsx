import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { MLDemoApi } from "../api/MLDemoApi";
import { ImageInfo } from "./ImageInfo";
import ObjectModelViewer from "./ObjectModelViewer";

const ObjectModelViewerContainer = () => {
    const [imageInfo, setImageInfo] = useState<ImageInfo | undefined>(
        undefined
    );
    const [processedImage, setProcessedImage] = useState<string | undefined>(
        undefined
    );

    // const updateApiResponses = useCallback((category: string) => {
    //     if (!imageInfo) {
    //         console.error(`Image not set!'`);
    //         return;
    //     }

    //     console.log(`Classification received for ${imageInfo.file.name}: ${category}`);

    //     imageInfo.status = "complete";
    //     imageInfo.category = category;
    //     imageInfo.endTime = new Date().getTime();

    //     setImageInfo(imageInfo);
    // }, [imageInfo]);

    const onFilesChangedHandler = (files: File[]) => {
        setProcessedImage(undefined);
        setImageInfo({
            file: files[0],
            startTime: new Date().getTime(),
            category: undefined,
            endTime: undefined,
            status: "idle",
        });
    };

    useEffect(() => {
        if (imageInfo && !imageInfo.endTime) {
            const newImageInfo = {...imageInfo};
            MLDemoApi.objectModel(imageInfo.file)
                .then((img) => {
                    setProcessedImage(img);
                })
                .catch((err) => {
                    newImageInfo.failedMsg = `Error processing image: ${err.response?.data?.error ?? err.message}`;                    
                }).finally( () => {
                    newImageInfo.category = undefined;
                    newImageInfo.endTime = new Date().getTime();
                    setImageInfo(newImageInfo);
                });
        }
    }, [imageInfo]);

    return (
        <Box width={"60%"} margin={"0 auto"}>
            <h1>Object Model</h1>
            <ObjectModelViewer
                onFilesChangedHandler={onFilesChangedHandler}
                imageInfo={imageInfo}
                processedImage={processedImage}
            />
        </Box>
    );
};

export default ObjectModelViewerContainer;
