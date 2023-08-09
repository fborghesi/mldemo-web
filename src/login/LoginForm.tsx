import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import { Alert, Button, TextField } from "@mui/material";

const LoginFormSchema = yup.object({
    email: yup.string().email(),
    password: yup.string().min(3),
});

export type LoginFormType = yup.InferType<typeof LoginFormSchema>;

export type OnLoginHandler = (values: LoginFormType) => void;

export type LoginFormProps = {
    errorMessage?: string;
    onLogin: OnLoginHandler;
    disabled?: boolean;
};

const LoginForm = (props: LoginFormProps) => {
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(LoginFormSchema),
        mode: "onChange",
    });

    return (
        <Box>
            {props.errorMessage && (
                <Alert severity="error">{props.errorMessage}</Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit(props.onLogin)}
                noValidate
                sx={{ mt: 1, width: 380 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    {...register("email")}
                    error={!!formState.errors.email}
                    helperText={formState.errors.email?.message ?? ""}
                    disabled={!!props.disabled}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="password"
                    {...register("password")}
                    inputProps={{
                        "data-test": "password",
                    }}
                    error={!!formState.errors.password}
                    helperText={formState.errors.password?.message ?? ""}
                    disabled={!!props.disabled}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={!!props.disabled}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default LoginForm;
