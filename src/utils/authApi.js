import axios from 'axios';

// Tạo axios instance với base URL
const apiClient = axios.create({
  baseURL: "https://api-for-be.onrender.com",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post("/api/login", {
      email,
      password
    });
    return { ok: true, data: response.data };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      return { ok: false, data: error.response.data };
    } else if (error.request) {
      // Network error
      return { ok: false, data: { message: "Network error! Please check your connection." } };
    } else {
      // Other error
      return { ok: false, data: { message: "An unexpected error occurred!" } };
    }
  }
};

export const googleLogin = async ({ tokenId }) => {
  try {
    const response = await apiClient.post("/api/google-login", {
      tokenId
    });
    return { ok: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, data: error.response.data };
    } else if (error.request) {
      return { ok: false, data: { message: "Network error! Please check your connection." } };
    } else {
      return { ok: false, data: { message: "An unexpected error occurred!" } };
    }
  }
};

export const register = async ({ firstName, lastName, email, password, phoneNumber }) => {
  try {
    const response = await apiClient.post("/api/customer/create-user", {
      firstName,
      lastName,
      email,
      password,
      phoneNumber
    });
    return { ok: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, data: error.response.data };
    } else if (error.request) {
      return { ok: false, data: { message: "Network error! Please check your connection." } };
    } else {
      return { ok: false, data: { message: "An unexpected error occurred!" } };
    }
  }
};

// Thêm API verify email
export const verifyEmail = async (token) => {
  try {
    const response = await apiClient.get("/api/verify-email", {
      params: { token }
    });
    return { ok: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, data: error.response.data };
    } else if (error.request) {
      return { ok: false, data: { message: "Network error! Please check your connection." } };
    } else {
      return { ok: false, data: { message: "An unexpected error occurred!" } };
    }
  }
};

// Export axios instance để sử dụng cho các API khác
export default apiClient;