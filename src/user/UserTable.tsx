import React, { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueFormatterParams,
} from "@mui/x-data-grid";
import { UserType } from "../api/UserType";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import { useAuthContext } from "../auth/AuthContext";
import QuickDialog from "../components/QuickDialog";
import Tooltip from "@mui/material/Tooltip";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";

type onUserEvent = (id: string) => void;

type UserTableProps = {
    users: UserType[];
    onDelete: onUserEvent;
    onToggleAdmin: onUserEvent;
    onToggleActive: onUserEvent;
};

const UserTable = (props: UserTableProps) => {
    const { user } = useAuthContext();
    const [quickDialogOpen, setQuickDialogOpen] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
        undefined
    );

    const deleteClickHandler = (id: string) => {
        setSelectedUserId(id);
        setQuickDialogOpen(true);
    };

    const columns: GridColDef[] = [
        //{ field: "id", headerName: "Id", width: 130 },
        {
            field: "first_name",
            headerName: "First name",
            headerAlign: "center",
            align: "center",
            width: 150,
        },
        {
            field: "last_name",
            headerName: "Last name",
            headerAlign: "center",
            align: "center",
            width: 150,
        },
        {
            field: "email",
            headerName: "E-mail Address",
            headerAlign: "center",
            align: "center",
            width: 300,
        },
        {
            field: "changed",
            headerName: "Last Change",
            headerAlign: "center",
            align: "center",
            width: 200,
            valueFormatter: (params: GridValueFormatterParams<number>) => {
                return params.value > 0
                    ? new Date(params.value * 1000).toLocaleString()
                    : "N/A";
            },
        },
        {
            field: "is_active",
            headerName: "Active",
            headerAlign: "center",
            type: "boolean",
            width: 80,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <IconButton
                        aria-label="toggle-active"
                        disabled={params.row.id == user?.id}
                        color={
                            params.row.is_active && params.row.id != user?.id
                                ? "info"
                                : "default"
                        }
                        onClick={() => {
                            setQuickDialogOpen(false);
                            props.onToggleActive(params.row.id);
                        }}
                    >
                        <Tooltip title="Toggle account active">
                            {params.row.is_active ? (
                                <ToggleOnIcon />
                            ) : (
                                <ToggleOffIcon />
                            )}
                        </Tooltip>
                    </IconButton>
                );
            },
        },
        {
            field: "is_admin",
            headerName: "Is Admin",
            headerAlign: "center",
            type: "boolean",
            width: 80,
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <IconButton
                        aria-label="toggle-administrator"
                        disabled={params.row.id == user?.id}
                        color={
                            params.row.is_admin && params.row.id != user?.id
                                ? "info"
                                : "default"
                        }
                        onClick={() => {
                            setQuickDialogOpen(false);
                            props.onToggleAdmin(params.row.id);
                        }}
                    >
                        <Tooltip title="Toggle administrator">
                            {params.row.is_admin ? (
                                <ToggleOnIcon />
                            ) : (
                                <ToggleOffIcon />
                            )}
                        </Tooltip>
                    </IconButton>
                );
            },
        },

        {
            field: "actions",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerName: "Actions",
            headerAlign: "center",
            width: 160,
            renderCell: (params: GridRenderCellParams<any, any, any>) => {
                return (
                    <Box margin="auto">
                        <IconButton
                            aria-label="delete"
                            color="error"
                            disabled={params.row.id == user?.id}
                            onClick={() => deleteClickHandler(params.row.id)}
                        >
                            <Tooltip title="Delete this user">
                                <DeleteIcon />
                            </Tooltip>
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    const GRID_WIDTH =
        100 +
        columns.reduce(
            (accum, col: GridColDef) => accum + (col.width ?? 100),
            0
        );

    return (
        <>
            <QuickDialog
                open={quickDialogOpen}
                title="Confirmation"
                onCancelClicked={() => setQuickDialogOpen(false)}
                onOkClicked={() => {
                    setQuickDialogOpen(false);
                    props.onDelete(selectedUserId as string);
                }}
            >
                <Box
                    display="flex"
                    flexDirection={"row"}
                    justifyContent="space-around"
                    alignItems="center"
                    width="400px"
                >
                    <WarningAmberRoundedIcon
                        color="primary"
                        fontSize="large"
                        style={{ margin: "10px" }}
                    />
                    Do you really want to remove this user? Once removed it can
                    not be restored.
                </Box>
            </QuickDialog>

            <div style={{ height: 400, width: `${GRID_WIDTH}px` }}>
                <DataGrid
                    rows={props.users}
                    columns={columns}
                    pageSizeOptions={[10]}
                />
            </div>
        </>
    );
};

export default UserTable;
