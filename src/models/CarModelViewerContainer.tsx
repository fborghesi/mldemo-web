import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { CarModelPrediction, MLDemoApi } from "../api/MLDemoApi";
import { ImageInfo } from "./ImageInfo";
import CarModelViewer from "./CarModelViewer";

const CarModelViewerContainer = () => {
    const [imageMap, setImageMap] = useState<Map<File, ImageInfo>>(new Map());

    const updateApiResponses = useCallback((file: File, pred: CarModelPrediction) => {
        if (!imageMap.has(file)) {
            console.error(`Map entry for file '${file} not found!'`);
            return;
        }

        const newImageMap = new Map<File, ImageInfo>(imageMap);

        const carImage = newImageMap.get(file);
        carImage!.status = "complete";
        carImage!.category = pred.score > 0.5 ? `${pred.class} (${Math.trunc(pred.score * 10000) / 100}%)` : "Unknown";
        carImage!.endTime = new Date().getTime();

        setImageMap(newImageMap);
    }, [imageMap]);

    const onFilesChangedHandler = (files: File[]) => {
        const newImageMap = new Map<File, ImageInfo>(
            files.map((file) => {
                return [
                    file,
                    {
                        file,
                        startTime: new Date().getTime(),
                        category: undefined,
                        endTime: undefined,
                        status: "idle",
                    },
                ];
            })
        );
        setImageMap(newImageMap);
    };

    useEffect(() => {
        imageMap.forEach((value, key) => {
            if (!value.endTime) {
                MLDemoApi.carModel(key).then((pred) =>
                    updateApiResponses(key, pred)
                ).catch(err => 
                    console.log(666, err)
                );
            }
        });
    }, [imageMap, setImageMap, updateApiResponses]);

    return (
        <Box width="60%" margin={"0 auto"}>
            <h1>Car Model</h1>
            <CarModelViewer
                onFilesChangedHandler={onFilesChangedHandler}
                images={imageMap}
            />
        </Box>
    );
};

export default CarModelViewerContainer;
