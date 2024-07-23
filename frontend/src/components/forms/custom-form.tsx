import React, { useEffect, useContext } from 'react';
import { useForm, Controller, FormProvider, useFieldArray, useWatch } from 'react-hook-form';
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
  IconButton,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BooksContext } from '../../context/books-context'; // Import BooksContext
import StudentInformation from './student-information';
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
  currentRole?: string; // Added prop for current role
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
  const { books } = useContext(BooksContext); 
  const methods = useForm({
    defaultValues: initialData,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });

  const { control, handleSubmit, formState, getValues, reset, watch } = methods;
  const { fields: fieldArray, append, remove } = useFieldArray({
    control,
    name: 'books',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (onRoleChange) {
      reset({ ...getValues(), role: currentRole });
    }
  }, [currentRole, getValues, onRoleChange, reset]);

  const formSubmit = (data: any) => {
    onSubmit(data, toUpdate);
  };

  // Watch for changes in issue dates
  const watchedBooks = useWatch({ name: 'books', control });

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
                              onRoleChange(event); // Call onRoleChange when role changes
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
            {currentRole === 'student' && (
              <StudentInformation /> 
            )}
            {formType === 'user' && (
              <>
                {fieldArray.map((item, index) => (
                  <Grid container spacing={1} key={item.id} className={classes.bookRow}>
                    <Grid item xs={4}>
                      <Controller
                        name={`books[${index}].book`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Book</InputLabel>
                            <Select
                              {...field}
                              label="Book"
                              error={!!(formState.errors.books as any)?.[index]?.book}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.isbn} value={book.isbn}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {(formState.errors.books as any)?.[index]?.book && (
                              <Typography color="error">
                                {(formState.errors.books as any)[index]?.book?.message as string}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Controller
                        name={`books[${index}].issueDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Issue Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={!!(formState.errors.books as any)?.[index]?.issueDate}
                            helperText={(formState.errors.books as any)?.[index]?.issueDate?.message as string}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Controller
                        name={`books[${index}].returnDate`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Return Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            disabled={!watchedBooks[index]?.issueDate}
                            error={!!(formState.errors.books as any)?.[index]?.returnDate}
                            helperText={(formState.errors.books as any)?.[index]?.returnDate?.message as string}
                          />
                        )}
                      />
                    </Grid>
                    {index > 0 && (
                      <Grid item xs={2} className={classes.deleteButton}>
                        <IconButton onClick={() => remove(index)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={() => append({ book: '', issueDate: '', returnDate: '' })}
                  startIcon={<Add />}
                  className={classes.addBookButton}
                >
                  Add Book
                </Button>
              </>
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
