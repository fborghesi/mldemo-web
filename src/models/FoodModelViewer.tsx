import React, { ChangeEvent } from "react";
import { useEffect, useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { LayersModel } from "@tensorflow/tfjs-layers";
import { Alert, Slider, Grid, Box} from "@mui/material";
import useInterval from "../utils/useInterval";


const IMG_WIDTH = 400;
const IMG_HEIGHT = 400;

const MODEL_WIDTH = 80;
const MODEL_HEIGHT = 80;

const MAX_PROB_THRESHOLD = 0.5;


const TIMEOUT_MS_MIN = 100;
const TIMEOUT_MS_MAX = 1500;
const TIMEOUT_MS_STEP = 100;
const TIMEOUT_MS_DEFAULT = 300;
// const TIMEOUT_MS_MARKS: {value: number, label: string}[] = range(TIMEOUT_MS_MIN, TIMEOUT_MS_MAX, TIMEOUT_MS_STEP).map(i => ({value: i, label: `${i}`}))


const videoConstraints = {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    //facingMode: "user",
    facingMode: { ideal: "environment" }
};



const bwValue = (r: number, g: number, b: number): number => {
    return (r / 255 + g / 255 + b / 255) / 3;
};


// converts a color image into an array of BW pixels
const imageData2BWArray = (imageData: ImageData, modelWidth: number): number[][][]  => {
    const bwArray: number[][][] = [];
    const line: number[][] = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
        // each pixel is represented as an array of length 1
        // containing the average RGB in a scale of 0 through 1
        const bw = bwValue(
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2]
        );

        // append one pixel to the line
        line.push([bw]);

        // line > MODEL_WIDTH pixels?
        if (line.length == modelWidth) {
            // append line and start with next one
            bwArray.push([...line]);
            line.length = 0;
        }
    }

    return bwArray;
};

const findMaxValueIndex = (values: Uint8Array | Float32Array | Int32Array): [number, number] => {
    let maxValue = 0;
    let maxValueIndex = -1;

    for(let i = 0; i < values.length; i++) {
        if (values[i] > maxValue) {
            maxValue = values[i];
            maxValueIndex = i;
        }
    }

    return [maxValueIndex, maxValue];
};

const getPredictionText = (values: Uint8Array | Float32Array | Int32Array): string => {
    const [predictedClassIndex, predictedClassProb] = findMaxValueIndex(values);
    if (predictedClassProb >= MAX_PROB_THRESHOLD) {
        return `${classLabels[predictedClassIndex]} (${predictedClassProb.toFixed(9)})`;
    }

    return `None (${predictedClassProb.toFixed(9)} < ${MAX_PROB_THRESHOLD})`;
};


const predict = async (model: LayersModel, data: number[][][]) => {
    const tensor = tf.tensor4d([data]);

    const predictions = (model?.predict(tensor) as tf.Tensor).dataSync();            
    if (predictions) {
        const predictionArray = await predictions;
        return getPredictionText(predictionArray);
    }

    return "";
};




const FoodModelViewer = () => {
    // takes a snapshot and update snapshotImg property if timeoutMs elapsed
    const intervalHandler = () => {
        console.log("Interval Handler invoked");     

        // take snapshot
        const imgSrc = webcamRef?.current?.getScreenshot();
        if (imgSrc) {

            // capture the snapshot and save it on snapshotImg
            const img = new Image();
            img.src = imgSrc;
            setSnapshotImg(img);
        }
    };
    const [timeoutMs, setTimeoutMs] = useState<number>(TIMEOUT_MS_DEFAULT);
    const {start, setDelay, clear} = useInterval(intervalHandler, timeoutMs);
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [tensorflowModel, setTensorflowModel] = useState<LayersModel | null>(null);
    const [prediction, setPrediction] = useState<string>("");
    const processingRef = useRef<boolean>(false);
    const [snapshotImg, setSnapshotImg] = useState<CanvasImageSource | null>(null); // the latest snapshot taken
    

    // update delay when timer moves
    useEffect(() => {setDelay(timeoutMs)}, [timeoutMs]);
    
    // predict when snapshot image changes
    useEffect(() => {
        try {            
            const ctx = canvasRef?.current?.getContext("2d");
            if (processingRef.current || !tensorflowModel || !ctx || !snapshotImg) return;
            
            processingRef.current = true;
            
            // capture the snapshot and save it on snapshotImg
            ctx.drawImage(
                snapshotImg,
                0, 0, IMG_WIDTH, IMG_HEIGHT,
                0, 0, MODEL_WIDTH, MODEL_HEIGHT
            );

            // obtain the image data as pixels
            const imageData = ctx.getImageData(0, 0, MODEL_WIDTH, MODEL_HEIGHT);
            if (!imageData) return;

            // connvert the image to grayscale
            const bwData = imageData2BWArray(imageData, MODEL_WIDTH);
            
            // predicts and updates the prediction label
            const updatePrediction = async (data: number[][][]) => {
                const label = await predict(tensorflowModel, data);
                setPrediction(label);
            }

            // predict
            updatePrediction(bwData);
        }
        finally {
            processingRef.current = false;
        }
    }, [snapshotImg])

    // init
    useEffect(() => {
        const loadModel = async () => {
            const model = await tf.loadLayersModel("final_cnn_model_drop_out.json");
            setTensorflowModel(model);
            start();
        };
        
        loadModel();

        return () => {
            clear();
        }
    }, []);

    const timeOutMsChangeHandler = (e: Event, newValue: number | number[]) => {
        console.log(`Setting refresh rate to ${newValue} ms.`);
        processingRef.current = false;
    setTimeoutMs(newValue as number);
    }

    return (
        <>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={6}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        height={IMG_HEIGHT}
                        width={IMG_WIDTH}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Grid container>
                        <Grid item xs={12} alignItems={"center"} justifyContent={"center"}>
                            <canvas 
                                ref={canvasRef} 
                                width={MODEL_WIDTH} 
                                height={MODEL_HEIGHT} 
                            />
                        </Grid>

                        <Grid item xs={12}>
                            Refresh rate (ms):
                            <Slider 
                                defaultValue={TIMEOUT_MS_DEFAULT}                                 
                                valueLabelDisplay="auto" 
                                onChange={timeOutMsChangeHandler} 
                                min={TIMEOUT_MS_MIN}
                                max={TIMEOUT_MS_MAX}
                                step={TIMEOUT_MS_STEP}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item xs={6}></Grid>

            </Grid>

            <Alert severity="success">Prediction: {prediction}</Alert>

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