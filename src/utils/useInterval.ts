import React, { useEffect, useRef } from "react";

type IntervalHandler = () => void;

type StartFnType = () => void;
type SetDelayFnType = (delayMs: number) => void;
type ClearFnType = () => void;

type useIntervalReturnType = {
    start: StartFnType,
    setDelay: SetDelayFnType,
    clear: ClearFnType
}

const useInterval = (handler: IntervalHandler, delayMs: number): useIntervalReturnType => {
    const handlerRef = useRef(handler);
    const delayMsRef = useRef(0);
    const timerRef = useRef<NodeJS.Timer | null>(null);

    const start: StartFnType = () => {
        const fn = handlerRef.current;

        clear(); // make sure no interval is already set
        timerRef.current = setInterval(fn, delayMsRef.current)
    }

    const setDelay: SetDelayFnType = (delayMs: number) => {
        delayMsRef.current = delayMs;
        start();
    };

    const clear: ClearFnType = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    return {start, setDelay, clear};
};

export default useInterval;