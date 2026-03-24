import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import DeleteIcon from "@mui/icons-material/Delete";

export default function ButtonDeleteStudent() {
    return (
        <div>


            <Tooltip title="Delete">
                <IconButton color="error" size="small">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </div>
    )
}
