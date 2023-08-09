import { Button, Icon, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React, { createRef, useCallback, useEffect, useState } from "react";
import Dropzone, { Accept, DropzoneRef, useDropzone } from "react-dropzone";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const acceptedTypes: Accept = {
    "image/*": [".jpeg", ".jpg", ".png"],
};

type OnFilesChangedHandler = (files: File[]) => void;

type ImageUploadProps = {
    onFilesChanged: OnFilesChangedHandler;
    multiple?: boolean;
};

const DEFAULT_HEIGHT = "auto";
const DEFAULT_WIDTH = "auto";
const DEFAULT_MILTIPLE = true;

const ImageUpload = (props: ImageUploadProps) => {

    const onDropHandler = (files: File[]) => {
        if (props.onFilesChanged) {
            props.onFilesChanged(files);
        }
    };


    const {
        getRootProps,
        getInputProps,
        open: openFileDialog,
        acceptedFiles,
    } = useDropzone({
        accept: acceptedTypes,
        multiple: props.multiple ?? DEFAULT_MILTIPLE,
        noClick: true,
        onDrop: onDropHandler,

    });

   
    return (
        <div {...getRootProps()} className="img-upload-drop-area" style={{width: "100%", margin: "auto"}}>
            <input {...getInputProps()} />
            <Box display={"flex"} flexDirection="row" flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"}>
                <Box>
                    Drag and drop image files here, or click the
                    button to manually select the files:
                </Box>
                <Box
                    style={{ flexBasis: "100%", height: "5px" }}
                ></Box>
                <IconButton
                    aria-label="Load images"
                    color="success"
                    onClick={openFileDialog}
                >
                    <AddPhotoAlternateIcon />
                </IconButton>
            </Box>
        </div>
    );
};

export default ImageUpload;
