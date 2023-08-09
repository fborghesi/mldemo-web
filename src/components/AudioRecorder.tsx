import { useState, useRef } from "react";
import { Button, Alert } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import HearingIcon from "@mui/icons-material/Hearing";
import HearingDisabledIcon from "@mui/icons-material/HearingDisabled";

const mimeType = "audio/webm";

type OnAudioAvailableHandler = (audioBlob: Blob | null) => void;

type AudioRecorderProps = {
    onAudioAvailable: OnAudioAvailableHandler;
};

const AudioRecorder = (props: AudioRecorderProps) => {
    const [permission, setPermission] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isRecording, setRecording] = useState<boolean>(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const startRecording = () => {
        setRecording(true);

        // notify data is available
        if (props.onAudioAvailable) {
            props.onAudioAvailable(null);
        }

        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream as MediaStream, {
            mimeType: mimeType,
        });

        //set the MediaRecorder instance to the mediaRecorder ref and start recording
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChunks: Blob[] = [];

        // capture data available event
        mediaRecorder.current.ondataavailable = (event) => {
            if (event.data?.size > 0) {
                localAudioChunks.push(event.data);
            }
        };

        // capture stop recording event
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            const audioBlob = new Blob(localAudioChunks, { type: mimeType });
            localAudioChunks.length = 0;

            // notify data is available
            if (props.onAudioAvailable) {
                props.onAudioAvailable(audioBlob);
            }
        };
    };

    const stopRecording = () => {
        setRecording(false);

        //stops the recording instance, if any
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
        }
    };

    const recordingClickHandler = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const getMicrophoneClickHandler = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                setErrorMsg((err as Error).message);
            }
        } else {
            setErrorMsg(
                "The MediaRecorder API is not supported in your browser."
            );
        }
    };

    return (
        <>
            {errorMsg ? (
                <Alert severity="error">errorMsg</Alert>
            ) : (
                <main>
                    <div className="audio-controls">
                        {!permission && (
                            <Button
                                startIcon={<MicIcon />}
                                onClick={getMicrophoneClickHandler}
                            >
                                Get Microphone
                            </Button>
                        )}
                        {permission && (
                            <Button
                                color={isRecording ? "error" : "success"}
                                startIcon={
                                    isRecording ? (
                                        <HearingIcon />
                                    ) : (
                                        <HearingDisabledIcon />
                                    )
                                }
                                onClick={recordingClickHandler}
                            >
                                {isRecording
                                    ? "Stop Recording"
                                    : "Not Recording"}
                            </Button>
                        )}
                    </div>
                </main>
            )}
        </>
    );
};
export default AudioRecorder;
