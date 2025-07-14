import React from "react";
import { Employee } from "../../types/Employee";
import styles from "./EmployeeDetails.module.css";

interface Props {
  employee: Employee;
}

const EmployeeDetails: React.FC<Props> = ({ employee }) => (
  <div className={styles.detailsContainer}>
    <h2 className={styles.name}>{employee.name}</h2>
    <hr className={styles.divider} />
    <div className={styles.detailRow}>
      <span className={styles.label}>Age:</span>
      <span>{employee.age}</span>
    </div>
    <div className={styles.detailRow}>
      <span className={styles.label}>Class:</span>
      <span>{employee.class}</span>
    </div>
    <div className={styles.detailRow}>
      <span className={styles.label}>Attendance:</span>
      <span>{employee.attendance}%</span>
    </div>
    <div className={styles.detailRow}>
      <span className={styles.label}>Subjects:</span>
      <span>{employee.subjects.join(", ")}</span>
    </div>
  </div>
);

export default EmployeeDetails;
