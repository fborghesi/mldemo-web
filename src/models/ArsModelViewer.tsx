/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { CircularProgress, Link } from "@mui/material";
import Alert from '@mui/material/Alert';
import AudioRecorder from "../components/AudioRecorder";

type SpeechToTextHandler = (audioBlob: Blob) => Promise<string>;

type ArsModelViewerProps = {
    speechToTextHandler: SpeechToTextHandler
}

const ArsModelViewer = (props: ArsModelViewerProps) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);

    const handleAudioAvailable = async (audioBlob: Blob | null) => {
        setText("");
        
        // reset view if no audio
        if (!audioBlob) {
            setText("");
            setAudioUrl(null)
            return;
        }
          

        // transform audio into text
        if (props.speechToTextHandler) {
            setProcessing(true);
            const text = await props.speechToTextHandler(audioBlob);
            setText(text);
            setProcessing(false);
        }

        //creates a playable URL from the blob file
        setAudioUrl(URL.createObjectURL(audioBlob));
    }
   
    return (
        <>
            <AudioRecorder onAudioAvailable={handleAudioAvailable}></AudioRecorder>

            {processing && <CircularProgress/>}

            {text != "" && (<
                Alert severity="info">
                {text}
                </Alert>
            )}

            {audioUrl && (
                <div className="audio-container">
                   <audio src={audioUrl} controls></audio>
                   <br/>
                   <Link href="audioUrl">Download Recording</Link>
                 </div>
              )}


        </>

    );
};

export default ArsModelViewer;
