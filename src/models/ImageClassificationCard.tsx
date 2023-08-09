/* eslint-disable @next/next/no-img-element */
import { CircularProgress, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { loadImage } from "../utils/loadImage";
import { useAsync } from "../utils/useAsync";

export type ImageClassificationCardProps = {
    file?: File;
    imageData?: string | undefined;
    category?: string | undefined;
    timeMs?: number | undefined;
    processing: boolean;
    imageHeight?: string | undefined;
};

const DEFAULT_IMG_HEIGHT = "150px";

const formatTimeMs = (timeMs: number): string => {
    return timeMs ? (Math.round(timeMs / 10) / 100).toFixed(2) : "";
};

const ImageClassificationCard = (props: ImageClassificationCardProps) => {
    const { execute, status, value: image, error } = useAsync(loadImage);

    useEffect(() => {
        if (props.file) {
            execute(props.file);
        }
    }, [execute, props.file]);

    if (status !== "success") {
        return <CircularProgress />;
    }

    return (
        <Paper
            elevation={3}
            // variant="outlined"
            square
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {props.file && (
                <Typography gutterBottom variant="h5" component="div">
                    {props.file.name}
                </Typography>
            )}

            <img
                src={props.imageData ?? (image as string)}
                alt={props.file?.name ?? ""}
                height={props.imageHeight ?? DEFAULT_IMG_HEIGHT}
                style={{ display: "block" }}
            />

            <Box display="flex" flexDirection={"column"} alignItems="left">
                {props.file && (
                    <Typography variant="body2" color="text.secondary">
                        File Size: {props.file.size.toLocaleString()} bytes
                    </Typography>
                )}
                {props.file && (
                    <Typography variant="body2" color="text.secondary">
                        File Type: {props.file.type}
                    </Typography>
                )}
                {props.timeMs && (
                    <Typography variant="body2" color="text.secondary">
                        Processing time: {formatTimeMs(props.timeMs)} secs.
                    </Typography>
                )}
                {props.category && (
                    <Typography variant="body1" color="text.primary">
                        Classification Category:{" "}
                        <Box sx={{ fontWeight: "bold" }} display="inline">
                            {props.category.toUpperCase()}
                        </Box>
                    </Typography>
                )}
                {props.processing && (
                    <Box width="100%" display="flex" justifyContent={"center"}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ImageClassificationCard;
