import axios from 'axios';
import { BASE_URL } from './url'; // Thêm dòng này

export const fetchAllProducts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/get-all-products`);
    // API trả về { errCode, errMessage, product: [...] }
    if (res.data && Array.isArray(res.data.product)) {
      return res.data.product;
    }
    return [];
  } catch (err) {
    return [];
  }
};