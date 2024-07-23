import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/user-context';
import CustomForm, { FormField } from '../components/forms/custom-form';
import * as yup from 'yup';

const UserFormContainer: React.FC = () => {
  const { addUser, users } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();

  const initialData = userId
    ? users.find((user) => user.id === userId) || { username: '', password: '', role: 'student', studentId: '', studentName: '', semesterEnrolled: '' }
    : { username: '', password: '', role: 'student', studentId: '', studentName: '', semesterEnrolled: '' };

  const [role, setRole] = useState(initialData.role);

  const handleUserSubmit = (data: any) => {
    addUser(data);
    navigate('/users');
  };

  const userFields: FormField[] = [
    { label: 'Username', name: 'username', type: 'text', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
    { label: 'Role', name: 'role', type: 'select', required: true, options: ['student', 'teacher', 'outsider'] },
  ];

  const studentFields: FormField[] = [
    { label: 'Student ID', name: 'studentId', type: 'text', required: true },
    { label: 'Student Name', name: 'studentName', type: 'text', required: true },
    { label: 'Semester Enrolled', name: 'semesterEnrolled', type: 'select', required: true, options: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'] },
  ];

  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
    role: yup.string().required('Role is required'),
    ...(role === 'student' && {
      studentId: yup.string().required('Student ID is required'),
      studentName: yup.string().required('Student Name is required'),
      semesterEnrolled: yup.string().required('Semester Enrolled is required'),
    }),
  });

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as string);
  };

  return (
    <CustomForm
      formType="user"
      initialData={initialData}
      toUpdate={!!userId}
      onSubmit={handleUserSubmit}
      fields={role === 'student' ? [...userFields, ...studentFields] : userFields}
      validationSchema={validationSchema}
    />
  );
};

export default UserFormContainer;
