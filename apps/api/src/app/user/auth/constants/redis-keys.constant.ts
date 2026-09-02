export const ResetPasswordKey = {
  cooldown: (email: string) => `reset-password:cooldown:${email}`,
  otp: (email: string) => `reset-password:otp:${email}`,
  session: (hashedToken: string) => `reset-password:session:${hashedToken}`,
} as const;
