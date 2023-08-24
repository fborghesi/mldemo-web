import React from "react";
import { useEffect, useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { Tensor4D } from "@tensorflow/tfjs";
import { LayersModel } from "@tensorflow/tfjs-layers";
import { Alert } from "@mui/material";
import { gridDensityValueSelector } from "@mui/x-data-grid";

const IMG_WIDTH = 400;
const IMG_HEIGHT = 400;

const MODEL_WIDTH = 80;
const MODEL_HEIGHT = 80;

const TIMEOUT_MS = 1000;

const videoConstraints = {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    facingMode: "user",
    //facingMode: { exact: "environment" }
};



const grayValue = (r: number, g: number, b: number): number => {
    return (r / 255 + g / 255 + b / 255) / 3;
};

const findMaxValueIndex = (values: Uint8Array | Float32Array | Int32Array): number => {
    let maxValue = 0;
    let maxValueIndex = -1;

    for(let i = 0; i < values.length; i++) {
        if (values[i] > maxValue) {
            maxValue = values[i];
            maxValueIndex = i;
        }
    }

    return maxValueIndex;
};

const FoodModelViewer = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [model, setModel] = useState<LayersModel | null>(null);
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [pred, setPred] = useState<string>("");

    // takes a snapshot and update screenshotSrc property
    const processSnapshot = () => {
        const imgSrc = webcamRef?.current?.getScreenshot();

        if (!canvasRef?.current || !imgSrc) {
            updateTimer();
            return;
        }

        const startTime = Date.now();
        const img = new Image();
        img.src = imgSrc;

        const ctx = canvasRef?.current?.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(
            img,
            0,
            0,
            IMG_WIDTH,
            IMG_HEIGHT,
            0,
            0,
            MODEL_WIDTH,
            MODEL_HEIGHT
        );
        setImageData(ctx.getImageData(0, 0, MODEL_WIDTH, MODEL_HEIGHT));
        console.log(`Canvas copy time: ${Date.now() - startTime} ms`);

        updateTimer();
    };

    useEffect(() => {
        if (!imageData) return;
        const startTime = Date.now();

        const pict: number[][][] = [];
        const line: number[][] = [];

        for (let i = 0; i < imageData.data.length; i += 4) {
            // each pixel is represented as an array of length 1
            // containing the average RGB in a scale of 0 through 1
            const gray = grayValue(
                imageData.data[i],
                imageData.data[i + 1],
                imageData.data[i + 2]
            );

            // append one pixel to the line
            line.push([gray]);

            // line > MODEL_WIDTH pixels?
            if (line.length == MODEL_WIDTH) {
                // append line and start with next one
                pict.push([...line]);
                line.length = 0;
            }
        }

        // create a tensor from an array of size 1 containing the
        // image data
        const pictData = [pict];
        const tensor = tf.tensor4d(pictData);

        const predict = async (tensor: Tensor4D) => {
            const predictions = (model?.predict(tensor) as tf.Tensor).dataSync();            
            let prediction = "";
            if (predictions) {
                const predictionArray = await predictions;
                const predictedClassIndex = findMaxValueIndex(predictionArray);
                const predictedClassLabel = predictedClassIndex >= 0 ? classLabels[predictedClassIndex] : "";
                prediction = predictedClassLabel;
            }

            setPred(prediction);
        };

        // predict
        predict(tensor);
        console.log(`Prediction time: ${Date.now() - startTime} ms`);
    }, [imageData]);

    // set the timer to take a snapshot every TIMEOUT_MS ms
    const updateTimer = () => {
        const t = setTimeout(processSnapshot, TIMEOUT_MS);
        setTimer(t);
    };

    // load the tsjs model
    const loadModel = async () => {
        const m = await tf.loadLayersModel("final_cnn_model_drop_out.json");
        setModel(m);
    };

    useEffect(() => {
        // componentDirMount
        updateTimer();
        loadModel();

        // componentWillUnmount
        return () => {
            // clear timer if it's not null
            timer && clearTimeout(timer);
        };
    }, []);

    return (
        <>
            <Webcam
                ref={webcamRef}
                audio={false}
                height={IMG_HEIGHT}
                width={IMG_WIDTH}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
            />

            <canvas ref={canvasRef} width={MODEL_WIDTH} height={MODEL_HEIGHT} />

            <Alert severity="success">Prediction: {pred}</Alert>
        </>
    );
};

export default FoodModelViewer;

const classLabels: string[] = [
    "apple_pie",
    "baby_back_ribs",
    "baklava",
    "beef_carpaccio",
    "beef_tartare",
    "beet_salad",
    "beignets",
    "bibimbap",
    "bread_pudding",
    "breakfast_burrito",
    "bruschetta",
    "caesar_salad",
    "cannoli",
    "caprese_salad",
    "carrot_cake",
    "ceviche",
    "cheesecake",
    "cheese_plate",
    "chicken_curry",
    "chicken_quesadilla",
    "chicken_wings",
    "chocolate_cake",
    "chocolate_mousse",
    "churros",
    "clam_chowder",
    "club_sandwich",
    "crab_cakes",
    "creme_brulee",
    "croque_madame",
    "cup_cakes",
    "deviled_eggs",
    "donuts",
    "dumplings",
    "edamame",
    "eggs_benedict",
    "escargots",
    "falafel",
    "filet_mignon",
    "fish_and_chips",
    "foie_gras",
    "french_fries",
    "french_onion_soup",
    "french_toast",
    "fried_calamari",
    "fried_rice",
    "frozen_yogurt",
    "garlic_bread",
    "gnocchi",
    "greek_salad",
    "grilled_cheese_sandwich",
    "grilled_salmon",
    "guacamole",
    "gyoza",
    "hamburger",
    "hot_and_sour_soup",
    "hot_dog",
    "huevos_rancheros",
    "hummus",
    "ice_cream",
    "lasagna",
    "lobster_bisque",
    "lobster_roll_sandwich",
    "macaroni_and_cheese",
    "macarons",
    "miso_soup",
    "mussels",
    "nachos",
    "omelette",
    "onion_rings",
    "oysters",
    "pad_thai",
    "paella",
    "pancakes",
    "panna_cotta",
    "peking_duck",
    "pho",
    "pizza",
    "pork_chop",
    "poutine",
    "prime_rib",
    "pulled_pork_sandwich",
    "ramen",
    "ravioli",
    "red_velvet_cake",
    "risotto",
    "samosa",
    "sashimi",
    "scallops",
    "seaweed_salad",
    "shrimp_and_grits",
    "spaghetti_bolognese",
    "spaghetti_carbonara",
    "spring_rolls",
    "steak",
    "strawberry_shortcake",
    "sushi",
    "tacos",
    "takoyaki",
    "tiramisu",
    "tuna_tartare",
    "waffles",
];