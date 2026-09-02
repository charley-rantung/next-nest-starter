export type ResetPasswordType = {
  otp: {
    hashedOtp: string;
    userId: number;
    email: string;
    attempts: number;
  };
  session: {
    userId: number;
    email: string;
  };
};
