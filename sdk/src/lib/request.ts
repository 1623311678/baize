import axiosInstance from "./axios-instance";

const getData = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const postData = async (url: string,data: any) => {
  const token = localStorage.getItem('token'); // 替换为实际获取Token的逻
  if(token){
  try {
    const response = await axiosInstance.post(url,data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}
};

export { getData, postData };
