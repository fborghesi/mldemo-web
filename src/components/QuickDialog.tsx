import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

type OnButtonClicked = () => void;

type QuickDialogProps = {
    children: React.ReactNode;
    open: boolean;
    title: string;
    okButtonText?: string;
    cancelButtonText?: string;
    onOkClicked?: OnButtonClicked;
    onCancelClicked?: OnButtonClicked;
};

const DEFAULT_OK_BUTTON_TEXT = "Ok";
const DEFAULT_CANCEL_BUTTON_TEXT = "Cancel";

const QuickDialog = (props: QuickDialogProps) => {
    

    const okClikckHandler = () => {
        if (props.onOkClicked) {
            props.onOkClicked();
        }
    };

    const cancelClickHandler = () => {
        if (props.onCancelClicked) {
            props.onCancelClicked();   
        }
    };

    return (
        <>
            <Dialog
                open={props.open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-contents"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-contents"> */}
                    {props.children}
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={okClikckHandler}>{props.okButtonText ?? DEFAULT_OK_BUTTON_TEXT}</Button>
                    <Button onClick={cancelClickHandler} autoFocus>
                        {props.cancelButtonText ?? DEFAULT_CANCEL_BUTTON_TEXT}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default QuickDialog;
