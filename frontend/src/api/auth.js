import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register/', data),
  verifyOtp: (data) => api.post('/auth/verify-otp/', data),
  resendOtp: (data) => api.post('/auth/resend-otp/', data),
  login: (data) => api.post('/auth/login/', data),
  refreshToken: (data) => api.post('/auth/token/refresh/', data),
  forgotPassword: (data) => api.post('/auth/forgot-password/', data),
  resetPassword: (data) => api.post('/auth/reset-password/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
};
