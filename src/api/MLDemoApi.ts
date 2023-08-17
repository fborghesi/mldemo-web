import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { UserType, LoggedUserType } from "./UserType";
import ArsResponseDataType from "./ArsResponseDataType";
import Base64Utils from "../utils/Base64Utils";

type ExpiredTokenCallback = () => void;

export type CredentialsType = {
    email: string;
    password: string;
};

export type ServerLoginResponseType = {
    message: string;
    data: UserType;
};

export type CarModelPrediction = {
    class: string;
    score: number;
};

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
    timeout: 100 * 1000,
    headers: {
        "Content-Type": "application/json",
    },
});



const extract_error_msg = (
    e: unknown,
    defaultMsg: string = "Operation failed. Please check your connectivity and try again."
): string => {
    let msg = defaultMsg;

    if (e) {
        if (e instanceof AxiosError) {
            msg = e.response?.data?.error ?? e.message;
        } else if (e instanceof Error) {
            msg = (e as Error).message;
        } else {
            msg = e as string;
        }
    }

    return msg;
};

let reqInterceptorId = -1;
let resInterceptorId = -1;

export const MLDemoApi = {
    setApiToken: (
        token: string | undefined,
        expiredTokenHandler: ExpiredTokenCallback
    ) => {
        if (reqInterceptorId >= 0) {
            axiosInstance.interceptors.request.eject(reqInterceptorId);
        }

        reqInterceptorId = axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
                if (config && config.headers) {
                    config.headers["authorization"] = token as string;
                }
                return config;
            },
            (err: any) => {
                return Promise.reject(err);
            }
        );

        if (resInterceptorId >= 0) {
            axiosInstance.interceptors.response.eject(resInterceptorId);
        }
        resInterceptorId = axiosInstance.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err instanceof AxiosError) {
                    if (err.response && err.response.status === 401) {
                        expiredTokenHandler();
                    }
                }
                return Promise.reject(err);
            }
        );
    },

    login: async (credentials: CredentialsType): Promise<LoggedUserType> => {
        try {
            const response = await axiosInstance.post("/user/login", {
                email: credentials.email,
                password: credentials.password,
                // provider: "local",
            });
            if (response.data.message === "Success") {
                return Promise.resolve(response.data.data);
            } else {
                return Promise.reject(
                    JSON.parse(response.data.error)._schema[0]
                );
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },

    carModel: async (file: File): Promise<CarModelPrediction> => {
        try {
            const response = await axiosInstance.post("/car-model", file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (response.data.message === "Success") {
                return Promise.resolve(response.data.data);
            } else {
                return Promise.reject(response.data.message);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    objectModel: async (file: File): Promise<string> => {
        const maxRetries = 4;

        for(let i =0 ; i < maxRetries; i++) {
            try {
                console.log(`Invoking /object-model, attempt #${i + 1}`);
                const response = await axiosInstance.post("/object-model", file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                if (response.status === 200) {
                    return Promise.resolve(
                        "data:image/png;base64, " + response.data
                    );
                } else {
                    return Promise.reject(response);
                }
            } catch (err: any) {
                if (err.status === 504 && i >= maxRetries) {
                    return Promise.reject(err);
                }
            }
        }

        return "";
    },

    getUsers: async (): Promise<UserType[]> => {
        try {
            const response = await axiosInstance.get("/user");
            if (response.data.message === "Success") {
                return Promise.resolve(response.data.data);
            } else {
                return Promise.reject(JSON.parse(response.data.error));
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },

    deleteUser: async (id: string): Promise<undefined> => {
        try {
            const response = await axiosInstance.delete(`/user/${id}`);
            if (response.status === 204) {
                return Promise.resolve(undefined);
            } else {
                return Promise.reject(response.data.error);
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },

    getUser: async (id: string): Promise<UserType> => {
        const response = await axiosInstance.get(`/user/${id}`);
        if (response.data.message === "Success") {
            return Promise.resolve(response.data.data);
        } else {
            return Promise.reject(JSON.parse(response.data.error));
        }
    },

    updateUser: async (user: UserType): Promise<undefined> => {
        try {
            const response = await axiosInstance.put(`/user/${user.id}`, {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                is_admin: user.is_admin,
                is_active: user.is_active,
            });
            if (response.status === 204) {
                return Promise.resolve(undefined);
            } else {
                return Promise.reject(JSON.parse(response.data.error));
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },

    speechToText: async (audioBlob: Blob): Promise<string> => {
        try {
            const response = await axiosInstance.post(`/s2t-model`, audioBlob, {
                headers: {
                    "Content-Type": audioBlob.type,
                }
            });
            if (response.status == 200) {
                const responseData = response.data;
                //const text = responseData.data.text;
                const text = responseData.data;
                return Promise.resolve(text);
            } else {
                return Promise.reject(JSON.parse(response.data.error));
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },


    arsReply: async (audioBlob: Blob, hintsList: string[] | null): Promise<ArsResponseDataType> => {
        const b64Audio = await Base64Utils.blobToBase64(audioBlob) as string;
        if (!b64Audio)
            return Promise.reject("No audio data available.");

        try {
            const data = {
                audio: b64Audio.substring(b64Audio.indexOf(",") + 1),
                hints: hintsList
            };
    
            const response = await axiosInstance.post(`/ars-model`, data);

            if (response.status == 200) {
                const responseData = response.data;

                const fixed: ArsResponseDataType = {
                    ...responseData.data, 
                    'responseAudio': "data:audio/mpeg;base64," + responseData.data.responseAudio }
                
                return Promise.resolve(
                    fixed
                );
            } else {
                return Promise.reject(JSON.parse(response.data.error));
            }
        } catch (e) {
            return Promise.reject(extract_error_msg(e));
        }
    },
};
