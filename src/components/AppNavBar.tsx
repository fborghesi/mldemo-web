import {
    Box,
    AppBar,
    Toolbar,
    Menu,
    MenuItem,
    Typography,
    Button,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";
import React, { useState, useEffect, MouseEvent } from "react";
import { UserType } from "../api/UserType";
import { useAuthContext } from "../auth/AuthContext";

const formatUserName = (user: UserType) => {
    return `${user.first_name} ${user.last_name}`;
};

const DEFAULT_LOGOUT_PATH = "/logout";

type AppNavBarProps = {
    logoutPath?: string;
};


const MODELS: {name: string, path: string}[] = [
    {name: 'Car side recognition', path: '/car-model'},
    {name: 'Object recognition', path: '/object-model'},
    {name: 'Speech recognition', path: '/ars-model'},
    {name: 'Food recognition', path: '/food-model'},
];

const AppNavBar = (props: AppNavBarProps) => {
    const [redirectPath, setRedirectPath] = useState<string | null>(null);
    const { user } = useAuthContext();
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (router.isReady && redirectPath) {
            router.replace(redirectPath);
        }
    }, [redirectPath]);


    const handleModelMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleModelMenuClose = (redirectPath?: string | undefined) => {
        setAnchorEl(null);
        if (redirectPath) {
            router.push(redirectPath);
        }
    };


    const logoutClickHandler = () => {
        router.push(props.logoutPath ?? DEFAULT_LOGOUT_PATH);
    };

    const handleManageUsersButtonClick = () => {
        router.push("/admin/users");
    };

    const modelMenu = (
        <Menu
            id="model-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleModelMenuClose()}
            MenuListProps={{
                "aria-labelledby": "basic-button",
            }}
        >
        {
            MODELS.map((model, index) => (
                <MenuItem key={index} onClick={() => handleModelMenuClose(model.path)}>{ model.name }</MenuItem>
                )
            )
        }
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Button
                        id="model-menu"
                        onClick={handleModelMenuClick}
                        variant="contained"
                        aria-controls={open ? 'model-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        style={{marginRight: "10px"}}
                    >
                        Models
                    </Button>
                    {modelMenu}

                    {user && user.is_admin && (
                        <Button
                            id="basic-button"
                            variant="contained"
                            onClick={handleManageUsersButtonClick}
                            style={{marginRight: "10px"}}
                        >
                            Manage Users
                        </Button>
                    )}
                    <Typography
                        component="div"
                        sx={{ flexGrow: 1, margin: "5px" }}
                    />
                    {user && (
                        <Button color="inherit" onClick={logoutClickHandler} startIcon=<LogoutIcon/>>
                            {formatUserName(user)}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppNavBar;
