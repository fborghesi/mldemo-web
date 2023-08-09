import { useCallback, useEffect, useState } from "react";

// Hook
export const useAsync = <ValueType, ParamType, ErrorType = string>(
    asyncFunction: (params: ParamType) => Promise<ValueType>
) => {
    const [status, setStatus] = useState<
      "idle" | "pending" | "success" | "error"
    >("idle");
    const [value, setValue] = useState<ValueType | null>(null);
    const [error, setError] = useState<ErrorType | null>(null);
    // The execute function wraps asyncFunction and
    // handles setting state for pending, value, and error.
    // useCallback ensures the below useEffect is not called
    // on every render, but only if asyncFunction changes.
    const execute = useCallback((params: ParamType) => {
        setStatus("pending");
        setValue(null);
        setError(null);
        return asyncFunction(params)
            .then((response: any) => {
                setValue(response);
                setStatus("success");
            })
            .catch((error: any) => {
                setError(error);
                setStatus("error");
            });
    }, [asyncFunction]);

    return { execute, status, value, error };
};
