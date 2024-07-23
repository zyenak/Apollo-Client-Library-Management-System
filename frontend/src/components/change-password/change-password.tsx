import React, { useEffect, forwardRef } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define validation schema with Yup
const schema = yup.object({
  newPassword: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/\d/, "Password must contain a number"),
  confirmPassword: yup.string()
    .required("Confirm password is required")
    .oneOf([yup.ref('newPassword'), ""], "Passwords must match"),

});

interface ChangePasswordDialogProps {
  open: boolean;
  handleClose: () => void;
  // handleSubmit: (newPassword: string, confirmPassword: string) => void;
}

const Transition = forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  handleClose,
  // handleSubmit,
}) => {
  const { control, handleSubmit: handleFormSubmit, formState: { errors, isValid }, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (data: any) => {
    console.log('New Password:', data.newPassword);
    console.log('Confirm Password:', data.confirmPassword);
    // handleSubmit(data.newPassword, data.confirmPassword);
    reset(); // Reset form fields after successful submit
  };

  useEffect(() => {
    if (!open) {
      reset(); // Reset form fields when dialog is closed
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Controller
          name="newPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              variant="standard"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="standard"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleFormSubmit(onSubmit)}
          disabled={!isValid}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
