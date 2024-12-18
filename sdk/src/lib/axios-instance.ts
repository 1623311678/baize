import axios from 'axios';

// 创建Axios实例
const axiosInstance = axios.create({
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从某个地方获取Token，例如从本地存储或上下文
    const token = localStorage.getItem('token'); // 替换为实际获取Token的逻

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理响应错误，例如Token过期等
    return Promise.reject(error);
  }
);

export default axiosInstance;
