import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/user-context';
import CustomForm, { FormField } from '../components/forms/custom-form';
import * as yup from 'yup';
import { SelectChangeEvent } from '@mui/material';

const UserFormContainer: React.FC = () => {
  const { addUser, users } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();

  const initialData = userId
    ? users.find((user) => user.id === userId) || { username: '', password: '', role: 'student', studentId: '', studentName: '', semesterEnrolled: '' }
    : { username: '', password: '', role: 'student', studentId: '', studentName: '', semesterEnrolled: '' };

  const [role, setRole] = useState(initialData.role);

  useEffect(() => {
    setRole(initialData.role);
  }, [userId, initialData.role]);

  const handleUserSubmit = (data: any) => {
    addUser(data);
    navigate('/users');
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setRole(event.target.value as string);
  };

  const userFields: FormField[] = [
    { label: 'Username', name: 'username', type: 'text', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
    { label: 'Role', name: 'role', type: 'select', required: true, options: ['student', 'teacher', 'outsider'] },
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

  return (
    <CustomForm
      formType="user"
      initialData={initialData}
      toUpdate={!!userId}
      onSubmit={handleUserSubmit}
      fields={userFields}
      validationSchema={validationSchema}
      onRoleChange={handleRoleChange}
      currentRole={role} // Pass the current role to CustomForm
    />
  );
};

export default UserFormContainer;
