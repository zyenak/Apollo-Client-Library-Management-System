import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BooksContext } from '../context/books-context';
import CustomForm, { FormField } from '../components/forms/custom-form';
import * as yup from 'yup';

const BookFormContainer: React.FC = () => {
  const { addBook, updateBook, books } = useContext(BooksContext);
  const navigate = useNavigate();
  const { bookIsbn } = useParams<{ bookIsbn?: string }>();

  const initialData = bookIsbn
    ? books.find((book) => book.isbn === bookIsbn) || {
        name: '',
        isbn: '',
        category: '',
        price: 0,
        quantity: 0,
        toUpdate: false,
      }
    : {
        name: '',
        isbn: '',
        category: '',
        price: 0,
        quantity: 0,
        toUpdate: false,
      };

  const handleBookSubmit = (data: any) => {
    data.toUpdate ? updateBook(data) : addBook(data);
    navigate('/');
  };

  const bookFields: FormField[] = [
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'ISBN', name: 'isbn', type: 'text', required: true },
    { label: 'Category', name: 'category', type: 'select', required: true, options: ['Sci-Fi', 'Action', 'Adventure', 'Horror', 'Romance', 'Mystery', 'Thriller', 'Drama', 'Fantasy', 'Comedy'] },
    { label: 'Price', name: 'price', type: 'number', required: true },
    { label: 'Quantity', name: 'quantity', type: 'number', required: true },
  ];

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    isbn: yup.string().required('ISBN is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().required('Price is required').positive('Price must be positive'),
    quantity: yup.number().required('Quantity is required').positive('Quantity must be positive'),
  });

  return (
    <CustomForm
      formType="book"
      initialData={initialData}
      toUpdate={!!bookIsbn}
      onSubmit={handleBookSubmit}
      fields={bookFields}
      validationSchema={validationSchema}
    />
  );
};

export default BookFormContainer;
