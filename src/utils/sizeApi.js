import axios from "axios";
import { BASE_URL } from "./url";

export async function fetchAllSizes(token) {
  try {
    const res = await axios.get(`${BASE_URL}/api/get-all-sizes`, {
      headers: token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
    // API trả về { sizes: [ { sizeId, sizeNumber }, ... ] }
    if (res.data && Array.isArray(res.data.sizes)) {
      return res.data.sizes;
    }
    return [];
  } catch {
    return [];
  }
}