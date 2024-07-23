import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormGroup } from '@mui/material';
import classes from './styles.module.css';

const StudentInformation: React.FC = () => {
  const { control, formState } = useFormContext();

  return (
    <FormGroup>
      <FormControl className={classes.mb2}>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Student ID"
              required
              error={!!formState.errors.studentId}
              helperText={formState.errors.studentId?.message as string || ''}
            />
          )}
        />
      </FormControl>
      <FormControl className={classes.mb2}>
        <Controller
          name="studentName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Student Name"
              required
              error={!!formState.errors.studentName}
              helperText={formState.errors.studentName?.message as string || ''}
            />
          )}
        />
      </FormControl>
      <FormControl className={classes.mb2}>
        <InputLabel>Semester Enrolled</InputLabel>
        <Controller
          name="semesterEnrolled"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Semester Enrolled"
              required
              error={!!formState.errors.semesterEnrolled}
            >
              {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {formState.errors.semesterEnrolled && (
          <Typography color="error">
            {formState.errors.semesterEnrolled.message as string || ''}
          </Typography>
        )}
      </FormControl>
    </FormGroup>
  );
};

export default StudentInformation;
