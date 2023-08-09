import { CircularProgress } from "@mui/material";
import { useCallback, useEffect } from "react";
import { MLDemoApi } from "../api/MLDemoApi";
import { UserType } from "../api/UserType";
import { useAsync } from "../utils/useAsync";
import Backdrop from "@mui/material/Backdrop";
import UserTable from "./UserTable";

type ToggleFunction = (user: UserType) => UserType;

type ToggleParams = {
    userId: string;
    toggleFn: ToggleFunction;
};

const UserTableContainer = () => {
    const {
        execute: getUsers,
        status: getUsersStatus,
        value: users,
        error: usersError,
    } = useAsync<UserType[], undefined>(MLDemoApi.getUsers);

    const {
        execute: toggleHandler,
        status: toggleStatus,
        value: toggleUser,
        error: toggleAdminError,
    } = useAsync<UserType, ToggleParams>(async (params: ToggleParams) => {
        const user = users?.find(u => u.id == params.userId) as UserType;
        const newUser = params.toggleFn(user);
        await MLDemoApi.updateUser(newUser);
        return newUser;
    });

    const deleteUserHandler = async (userId: string) => {
        await MLDemoApi.deleteUser(userId as string);
        getUsers(undefined);
    };

    const toggleAdminHandler = async (userId: string) => {
        toggleHandler({userId, toggleFn: u => ({...u, is_admin: !u.is_admin})});
    };

    const toggleActiveHandler = async (userId: string) => {
        toggleHandler({userId, toggleFn: u => ({...u, is_active: !u.is_active})});
    };

    useEffect(() => {
        if (getUsersStatus === "idle") {
            getUsers(undefined);
        }
    }, [getUsers, getUsersStatus]);

    const updateUser = useCallback((user: UserType) => {
        for (let i = 0; i < users!.length; i++) {
            let u = users![i] as UserType;
            if (u.id == user.id) {
                u.is_admin = user.is_admin;
                u.is_active = user.is_active;
            }
        }
    }, [users]);

    useEffect(() => {
        if (toggleStatus === "success") {
            updateUser(toggleUser!);
        }
    }, [getUsers, toggleStatus, users, updateUser, toggleUser]);


    const inProgress = getUsersStatus === "pending" || toggleStatus === "pending";

    return (
        <>
            <h1>Users</h1>
            <Backdrop open={inProgress} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                {inProgress && <CircularProgress color="inherit" />}
            </Backdrop>
            <UserTable
                    users={(users ?? new Array()) as UserType[]}
                    onDelete={deleteUserHandler}
                    onToggleAdmin={toggleAdminHandler}
                    onToggleActive={toggleActiveHandler}
                />

        </>
    );
};

export default UserTableContainer;
