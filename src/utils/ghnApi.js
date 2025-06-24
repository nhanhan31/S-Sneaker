import axios from "axios";

const BASE_URL = "https://api-for-be.onrender.com";

// Lấy danh sách tỉnh/thành phố
export const getProvinces = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/ghn/provinces`);
    return {
      ok: res.status === 200,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      data: { errMessage: "Không lấy được danh sách tỉnh/thành phố!" },
    };
  }
};

// Lấy danh sách quận/huyện theo provinceId
export const getDistricts = async (provinceId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/ghn/districts/${provinceId}`);
    return {
      ok: res.status === 200,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      data: { errMessage: "Không lấy được danh sách quận/huyện!" },
    };
  }
};

// Lấy danh sách phường/xã theo districtId
export const getWards = async (districtId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/ghn/wards/${districtId}`);
    return {
      ok: res.status === 200,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      data: { errMessage: "Không lấy được danh sách phường/xã!" },
    };
  }
};