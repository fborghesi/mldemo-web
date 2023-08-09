
export type ImageInfo = {
    file: File;
    startTime: number;
    category: string | undefined;
    endTime: number | undefined;
    status: "idle" | "in progress" | "complete" | "error";
    failedMsg?: string | undefined;
};
