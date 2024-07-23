import React, { useEffect, useContext } from 'react';
import { useForm, Controller, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Button,
  TextField,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StudentInformation from './student-information';
import BooksFieldArray from './issue-books';
import classes from './styles.module.css';

export type FormField =
  | { label: string; name: string; type: 'text' | 'number' | 'password'; required: boolean; options?: undefined }
  | { label: string; name: string; type: 'select'; required: boolean; options: string[] };

export interface CustomFormProps {
  formType: 'book' | 'user';
  initialData: any;
  toUpdate: boolean;
  onSubmit: (data: any, toUpdate: boolean) => void;
  fields: FormField[];
  validationSchema: yup.ObjectSchema<any>;
  onRoleChange?: (event: SelectChangeEvent<string>) => void;
  currentRole?: string;
}

const CustomForm: React.FC<CustomFormProps> = ({
  formType,
  initialData,
  toUpdate,
  onSubmit,
  fields,
  validationSchema,
  onRoleChange,
  currentRole,
}) => {
  const methods = useForm({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });

  const { control, handleSubmit, formState, getValues, reset } = methods;
  const navigate = useNavigate();

  useEffect(() => {
    if (onRoleChange) {
      reset({ ...getValues(), role: currentRole });
    }
  }, [currentRole, getValues, onRoleChange, reset]);

  const formSubmit = (data: any) => {
    onSubmit(data, toUpdate);
  };

  return (
    <FormProvider {...methods}>
      <Container component={Paper} className={classes.wrapper}>
        <Typography className={classes.pageHeader} variant="h5">
          {formType === 'book' ? 'Add or Update Book' : 'Add User'}
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(formSubmit)}>
          <FormGroup>
            {fields.map((field) => (
              <FormControl className={classes.mb2} key={field.name}>
                {field.type === 'select' ? (
                  <>
                    <InputLabel>{field.label}</InputLabel>
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: controllerField }) => (
                        <Select
                          {...controllerField}
                          label={field.label}
                          error={!!formState.errors[field.name]}
                          onChange={(event) => {
                            controllerField.onChange(event);
                            if (field.name === 'role' && onRoleChange) {
                              onRoleChange(event);
                            }
                          }}
                        >
                          {field.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {formState.errors[field.name] && (
                      <Typography color="error">
                        {formState.errors[field.name]?.message as string}
                      </Typography>
                    )}
                  </>
                ) : (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label={field.label}
                        type={field.type}
                        required={field.required}
                        error={!!formState.errors[field.name]}
                        helperText={formState.errors[field.name]?.message as string}
                      />
                    )}
                  />
                )}
              </FormControl>
            ))}
            {currentRole === 'student' && <StudentInformation />}
            {formType === 'user' && (
              <BooksFieldArray
                control={control}
                formState={formState}
                watch={useWatch({ name: 'books', control })}
                append={(value) => methods.setValue('books', [...methods.getValues('books'), value])}
                remove={(index) => methods.setValue('books', methods.getValues('books').filter((_: any, i: number) => i !== index))}
              />
            )}
          </FormGroup>
          <div className={classes.btnContainer}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formState.isValid}
            >
              {formType === 'book' ? 'Submit' : 'Add User'}
            </Button>
          </div>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CustomForm;
