import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";

interface ConfirmDeleteModalProps{
    handleDeleteProduct: () => void;
    name: string;
    deleteDisabled: boolean;
    disabledReason?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({handleDeleteProduct, name, deleteDisabled, disabledReason}) => {
    const [open, setOpen] = useState(false);

    const openDialog = () => setOpen(true);

    const closeDialog = () => setOpen(false);
    
    const handleCancel = () => closeDialog();

    const handleDelete = () => {
        handleDeleteProduct();
        closeDialog();
    };

    return  (
        <React.Fragment>
            <Button variant={ deleteDisabled ? "outlined" : "contained"} color="error" onClick={openDialog}>Delete</Button>
            <Dialog
                open={open}
                onClose={closeDialog}
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    { deleteDisabled ?
                        <>{disabledReason}</>
                        :
                       <>Are you sure you want to delete {name}?</>
                    }
                    
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    { deleteDisabled ?
                    <>  
                        <Button onClick={handleCancel} color="primary">
                            Ok
                        </Button>
                    </>
                    :
                    <>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="primary" autoFocus>
                            Delete
                        </Button>
                    </>
                    }
                   
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default ConfirmDeleteModal;