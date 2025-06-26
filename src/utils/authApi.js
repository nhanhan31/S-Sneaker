export const login = async ({ email, password }) => {
  try {
    const res = await fetch("https://api-for-be.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: "Network error!" } };
  }
};

export const googleLogin = async ({ tokenId }) => {
  try {
    const res = await fetch("https://api-for-be.onrender.com/api/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: "Network error!" } };
  }
};

export const register = async ({ firstName, lastName, email, password, phoneNumber }) => {
  try {
    const res = await fetch("https://api-for-be.onrender.com/api/customer/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { message: "Network error!" } };
  }
};