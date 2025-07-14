import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";
import { Employee } from "../../types/Employee";
import styles from "./EmployeeTileView.module.css";

interface Props {
  employee: Employee & { flagged?: boolean };
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFlag: () => void;
}

const EmployeeTileView: React.FC<Props> = ({
  employee,
  onClick,
  onEdit,
  onDelete,
  onFlag,
}) => {
  return (
    <Card
      className={styles.tile}
      onClick={onClick}
      tabIndex={0}
      elevation={3}
      role="button"
      aria-label={`Employee card for ${employee.name}`}
    >
      <CardContent className={styles.content}>
        <Box className={styles.info}>
          <Typography variant="h6" className={styles.name}>
            {employee.name}
          </Typography>

          <Typography variant="body2" className={styles.textLine}>
            <strong>Class:</strong> {employee.class}
          </Typography>

          <Typography variant="body2" className={styles.textLine}>
            <strong>Attendance:</strong> {employee.attendance}%
          </Typography>

          {employee.flagged && (
            <Typography
              variant="body2"
              color="error"
              style={{ fontWeight: "bold" }}
            >
              ⚑ Flagged
            </Typography>
          )}
        </Box>

        <div className={styles.separator} aria-hidden="true" />

        <Box
          className={styles.actions}
          onClick={(e) => e.stopPropagation()}
          aria-label="employee actions"
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              aria-label="edit employee"
              onClick={onEdit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={employee.flagged ? "Unflag" : "Flag"}>
            <IconButton
              size="small"
              color={employee.flagged ? "error" : "warning"}
              aria-label="flag employee"
              onClick={onFlag}
            >
              <FlagIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              aria-label="delete employee"
              onClick={onDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeTileView;
