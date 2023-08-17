/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useEffect, useState } from "react";
import { CircularProgress, Link } from "@mui/material";
import Alert from '@mui/material/Alert';
import AudioRecorder from "../components/AudioRecorder";
import ArsResponseDataType from '../api/ArsResponseDataType';
import TextField from '@mui/material/TextField';
import Box from "@mui/material";

type SpeechToTextHandler = (audioBlob: Blob, hintsList: string[] | null) => Promise<ArsResponseDataType>;

type ArsModelViewerProps = {
    speechToTextHandler: SpeechToTextHandler
}

const defaultHints = [
    'Respondes al nombre de Computadora, Computer o Puter', 
    'Tus respuestas deben rimar con la pregunta',
    'Tus respuestas son en broma',
    'Las primeras palabras de tu respuesta deben ser: "Lo siento, no he entendido tu pregunta, has querido decir"',
    'La respuesta debe ser corta',
    'Tus respuestas deben parecer inútiles',
];



const ArsModelViewer = (props: ArsModelViewerProps) => {
    const [audioInUrl, setAudioInUrl] = useState<string | null>(null);
    const [audioOutUrl, setAudioOutUrl] = useState<string | null>(null);
    const [audioInText, setAudioInText] = useState<string>("");
    const [audioOutText, setAudioOutText] = useState<string>("");
    const [processing, setProcessing] = useState<boolean>(false);
    const [hints, setHints] = useState<string>(defaultHints.join("\n"));

    const handleAudioAvailable = async (audioBlob: Blob | null) => {
        setAudioInText("");
        
        // reset view if no audio
        if (!audioBlob) {
            setAudioInText("");
            setAudioOutText("");
            setAudioInUrl(null)
            setAudioOutUrl(null)
            return;
        }
          

        // transform audio into text
        if (props.speechToTextHandler) {
            setProcessing(true);

            try {
                const hintsList = hints.split("\n");
                const response = await props.speechToTextHandler(audioBlob, hintsList);

                setAudioInUrl(URL.createObjectURL(audioBlob));
                setAudioInText(response.requestText);
                setAudioOutUrl(response.responseAudio);
                setAudioOutText(response.responseText);
                setProcessing(false);
            }
            finally {
                setProcessing(false);
            }
        }
    };

    useEffect(() => {
        if (audioOutUrl)
            new Audio(audioOutUrl).play();
    }, [audioOutUrl]);

    const hintsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setHints(event.target.value);
    };
   
    return (
        <>
            <TextField
                multiline
                rows={6}
                fullWidth
                value={hints}
                onChange={hintsChangeHandler}
            />
            <AudioRecorder onAudioAvailable={handleAudioAvailable}></AudioRecorder>
            {processing && <CircularProgress/>}

            {audioInText != "" && (<
                Alert severity="info">
                {audioInText}
                </Alert>
            )}
            {audioInUrl && (
                <div className="audio-container">
                   <audio src={audioInUrl} controls></audio>
                   <br/>
                   <Link href={audioInUrl}>Download Input Audio</Link>
                 </div>
              )}


            {audioOutText != "" && (<
                Alert severity="success">
                {audioOutText}
                </Alert>
            )}
        
            {audioOutUrl && (
               <div className="audio-container">
                  <audio src={audioOutUrl} controls></audio>
                  <br/>
                  <Link href={audioOutUrl}>Download Output Audio</Link>
                </div>
            )}
        </>

    );
};

export default ArsModelViewer;
