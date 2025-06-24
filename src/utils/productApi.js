import axios from 'axios';

export const fetchAllProducts = async () => {
  try {
    const res = await axios.get('https://api-for-be.onrender.com/api/get-all-products');
    // API trả về { errCode, errMessage, product: [...] }
    if (res.data && Array.isArray(res.data.product)) {
      return res.data.product;
    }
    return [];
  } catch (err) {
    return [];
  }
};