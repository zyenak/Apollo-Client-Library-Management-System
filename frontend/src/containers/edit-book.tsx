import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BooksContext } from "../context/books-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import withInputValidation from '../hoc/input-error-handling';
import * as yup from 'yup';

const EditBookFormContainer: React.FC = () => {
  const { bookIsbn } = useParams<{ bookIsbn: string }>();
  const { books, updateBook } = useContext(BooksContext);
  const navigate = useNavigate();

  // Find the book by isbn
  const bookToUpdate = books.find((book) => book.isbn === bookIsbn);

  if (!bookToUpdate) {
    return <div>Book not found</div>;
  }

  const handleBookSubmit = (data: any) => {
    updateBook(data);
    navigate("/books"); // Navigate to the books list page
  };

  const bookFields: FormField[] = [
    { label: "Name", name: "name", type: "text", required: true },
    { label: "ISBN", name: "isbn", type: "text", required: true },
    { label: "Category", name: "category", type: "select", required: true, options: ["Sci-Fi", "Action", "Adventure", "Horror", "Romance", "Mystery", "Thriller", "Drama", "Fantasy", "Comedy"] },
    { label: "Price", name: "price", type: "number", required: true },
    { label: "Quantity", name: "quantity", type: "number", required: true },
  ];

  // Validation schema for the book form
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    isbn: yup.string().required('ISBN is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().required('Price is required').positive('Price must be positive'),
    quantity: yup.number().required('Quantity is required').min(0, 'Quantity cannot be negative'),
  });

  // Define initialData
  const initialData = bookToUpdate;

  return (
    <CustomForm
      formType="book"
      initialData={initialData}
      toUpdate={true}
      onSubmit={handleBookSubmit}
      fields={bookFields}
      validationSchema={validationSchema}
    />
  );
};

export default EditBookFormContainer;
