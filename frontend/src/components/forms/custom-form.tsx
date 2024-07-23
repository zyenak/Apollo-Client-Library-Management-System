import React, { useEffect } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
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
} from '@mui/material';
import classes from './styles.module.css';
import { useNavigate } from 'react-router-dom';

export type FormField =
  | { label: string; name: string; type: 'text' | 'number' | 'password'; required: boolean; options?: undefined }
  | { label: string; name: string; type: 'select'; required: boolean; options: string[] };

export interface CustomFormProps {
  formType: 'book' | 'user';
  initialData: any;
  toUpdate: boolean;
  onSubmit: (data: any, toUpdate: boolean) => void;
  fields: FormField[];
  validationSchema: any;
}

const CustomForm: React.FC<CustomFormProps> = ({
  formType,
  initialData,
  toUpdate,
  onSubmit,
  fields,
  validationSchema,
}) => {
  const methods = useForm({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched', // Show validation errors on touched fields
  });

  const navigate = useNavigate();

  useEffect(() => {
    methods.reset(initialData);
  }, [initialData, methods]);

  const formSubmit = (data: any) => {
    onSubmit(data, toUpdate);
  };

  return (
    <FormProvider {...methods}>
      <Container component={Paper} className={classes.wrapper}>
        <Typography className={classes.pageHeader} variant="h5">
          {formType === 'book' ? 'Add or Update Book' : 'Add User'}
        </Typography>
        <form noValidate autoComplete="off" onSubmit={methods.handleSubmit(formSubmit)}>
          <FormGroup>
            {fields.map((field) => (
              <FormControl className={classes.mb2} key={field.name}>
                {field.type === 'select' ? (
                  <>
                    <InputLabel>{field.label}</InputLabel>
                    <Controller
                      name={field.name}
                      control={methods.control}
                      render={({ field: controllerField }) => (
                        <Select
                          {...controllerField}
                          label={field.label}
                          error={!!methods.formState.errors[field.name]}
                        >
                          {field.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {methods.formState.errors[field.name] && (
                      <Typography color="error">
                        {methods.formState.errors[field.name]?.message as string}
                      </Typography>
                    )}
                  </>
                ) : (
                  <Controller
                    name={field.name}
                    control={methods.control}
                    render={({ field: controllerField }) => (
                      <TextField
                        {...controllerField}
                        label={field.label}
                        type={field.type}
                        required={field.required}
                        error={!!methods.formState.errors[field.name]}
                        helperText={methods.formState.errors[field.name]?.message as string}
                      />
                    )}
                  />
                )}
              </FormControl>
            ))}
          </FormGroup>
          <div className={classes.btnContainer}>
            <Button
              variant="contained"
              color="secondary"
              // onClick={() => methods.reset(initialData)}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!methods.formState.isValid}
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
