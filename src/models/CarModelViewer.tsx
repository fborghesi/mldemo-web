import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import Carousel from "react-material-ui-carousel";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ImageClassificationCard from "./ImageClassificationCard";
import { ImageInfo } from "./ImageInfo";

type OnFilesChangedHandler = (files: File[]) => void;

type ObjectModelViewerProps = {
    onFilesChangedHandler: OnFilesChangedHandler;
    images: Map<File, ImageInfo>;
};

const CarModelViewer = (props: ObjectModelViewerProps) => {
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
                onFilesChanged={filesChangedHandler}
            ></ImageUpload>
            <Box style={{ flexBasis: "100%", height: "30px" }}></Box>

            <Carousel
                sx={{ width: "400px", minHeight: '300px' }}
                cycleNavigation={true}
                navButtonsAlwaysVisible={false}
                swipe={true}
                autoPlay={true}
                interval={2000}
                animation={"fade"}
                PrevIcon={<ArrowBackIosIcon />}
                NextIcon={<ArrowForwardIosIcon />}
            >
                {Array.from(props.images.values()).map((img) => {

                    return (
                        <ImageClassificationCard
                            key={img.file.name}
                            file={img.file}
                            category={img.category}
                            processing={!img.endTime}
                            timeMs={img.endTime ? img.endTime - img.startTime : undefined}
                        />
                    );
                })}
            </Carousel>
        </Box>
    );
};

export default CarModelViewer;
