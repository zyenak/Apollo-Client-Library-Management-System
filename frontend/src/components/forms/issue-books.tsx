import React, { useContext } from 'react';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, TextField, Typography, Grid, IconButton, Button } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { BooksContext } from '../../context/books-context'; // Import BooksContext
import classes from './styles.module.css';

interface BooksFieldArrayProps {
  control: any;
  formState: any;
  watch: any;
  append: (value: any) => void;
  remove: (index: number) => void;
}

const BooksFieldArray: React.FC<BooksFieldArrayProps> = ({ control, formState, watch, append, remove }) => {
  const { books } = useContext(BooksContext);
  const fieldArray = useFieldArray({
    control,
    name: 'books',
  });

  const watchedBooks = useWatch({ name: 'books', control });

  return (
    <>
      {fieldArray.fields.map((item, index) => (
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
  );
};

export default BooksFieldArray;
