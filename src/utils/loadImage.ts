import React from "react";

export const loadImage = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = function () {
            return resolve(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    });
};