import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Spin, message, Typography } from "antd";
import { getProvinces, getDistricts, getWards } from "../../utils/ghnApi";
import { updateUser } from "../../utils/userApi"; // Đảm bảo đã import
import { BASE_URL } from "../../utils/url";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../utils/fireBaseConfig"; // Import auth và RecaptchaVerifier từ firebaseConfig



const { Title } = Typography;

const EditInfo = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token"); // Thêm dòng này
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [wardCode, setWardCode] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);


  // Load provinces, districts, wards theo user
  useEffect(() => {
    setFormLoading(true);
    getProvinces().then((res) => {
      if (res.ok && Array.isArray(res.data.data)) {
        setProvinceList(res.data.data);
        if (user?.province) {
          const provinceNum = Number(user.province);
          setProvinceId(provinceNum);
          form.setFieldsValue({ province: provinceNum });
          getDistricts(provinceNum).then((res2) => {
            if (res2.ok && Array.isArray(res2.data.data)) {
              setDistrictList(res2.data.data);
              if (user?.district) {
                const districtNum = Number(user.district);
                setDistrictId(districtNum);
                form.setFieldsValue({ district: districtNum });
                getWards(districtNum).then((res3) => {
                  if (res3.ok && Array.isArray(res3.data.data)) {
                    setWardList(res3.data.data);
                    if (user?.wardCode) {
                      form.setFieldsValue({ wardCode: String(user.wardCode) });
                      setWardCode(String(user.wardCode));
                    }
                  }
                });
              }
            }
          });
        }
      }
      setFormLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  // Khi chọn province
  const handleProvinceChange = (value) => {
    const id = Number(value);
    setProvinceId(id);
    form.setFieldsValue({ province: id, district: undefined, wardCode: undefined });
    setDistrictList([]);
    setWardList([]);
    setDistrictId(null);
    setWardCode(null);
    setFormLoading(true);
    getDistricts(id).then((res) => {
      if (res.ok && Array.isArray(res.data.data)) {
        setDistrictList(res.data.data);
      }
      setFormLoading(false);
    }).catch(() => setFormLoading(false));
  };

  // Khi chọn district
  const handleDistrictChange = (value) => {
    const id = Number(value);
    setDistrictId(id);
    form.setFieldsValue({ district: id, wardCode: undefined });
    setWardList([]);
    setWardCode(null);
    setFormLoading(true);
    getWards(id).then((res) => {
      if (res.ok && Array.isArray(res.data.data)) {
        setWardList(res.data.data);
      }
      setFormLoading(false);
    }).catch(() => setFormLoading(false));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API cập nhật user, truyền thêm 2 trường bankName và bankAccountNumber
      await updateUser(user.userId, {
        ...values,
        bankName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
      }, token); // Sử dụng biến token vừa lấy

      // Cập nhật lại localStorage
      localStorage.setItem("user", JSON.stringify({ ...user, ...values }));
      message.success("Cập nhật thông tin thành công!");
    } catch (err) {
      message.error("Cập nhật thất bại!");
    }
    setLoading(false);
  };

  const sendOTP = async () => {
    const phone = form.getFieldValue("phoneNumber");
    if (!phone || !/^0\d{9}$/.test(phone)) {
      return message.error("Số điện thoại không hợp lệ. Ví dụ: 0901234567");
    }

    try {
      const fullPhone = "+84" + phone.slice(1); // Chuyển 0901234567 → +84901234567

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => { }
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      message.success("Mã OTP đã được gửi!");
    } catch (err) {
      console.error(err);
      message.error("Gửi OTP thất bại. Vui lòng thử lại.");
    }
  };



  const verifyOTP = async () => {
    if (!confirmationResult) return message.error("Vui lòng gửi mã OTP trước.");
    if (!otpCode) return message.error("Vui lòng nhập mã OTP.");

    try {
      setVerifying(true);
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;

      // 🔐 Lấy Firebase ID token để xác thực với backend
      const idToken = await user.getIdToken();

      // 📡 Gọi API backend
      const res = await fetch(`${BASE_URL}/api/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }) // 👈 Gửi token vào body
      });

      const data = await res.json();
      if (data.success) {
        message.success("Xác minh số điện thoại thành công!");
      } else {
        message.error(data.message || "Lỗi xác minh phía server.");
      }

    } catch (err) {
      console.error(err);
      message.error("Mã OTP sai hoặc hết hạn.");
    } finally {
      setVerifying(false);
    }
  };




  return (
    <div style={{ maxWidth: 600, margin: "0 20px", background: "#fff", padding: 32, borderRadius: 8, display: "flex", justifyContent: "flex-start" }}>
      <div style={{ width: "100%" }}>
        <Title level={3} style={{ marginBottom: 24 }}>Chỉnh sửa thông tin</Title>
        <Spin spinning={formLoading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber,
              address: user.address,
              province: user.province ? Number(user.province) : undefined,
              district: user.district ? Number(user.district) : undefined,
              wardCode: user.wardCode ? String(user.wardCode) : undefined,
              bankName: user.bankName,
              bankAccountNumber: user.bankAccountNumber,
            }}
            onFinish={onFinish}
          >
            <Form.Item label="Họ" name="firstName">
              <Input placeholder="Nhập họ" />
            </Form.Item>
            <Form.Item label="Tên" name="lastName">
              <Input placeholder="Nhập tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input
                placeholder="Nhập số điện thoại"
                onChange={() => {
                  setOtpSent(false);
                  setConfirmationResult(null);
                  setOtpCode("");
                }}
              />
            </Form.Item>
            <Button
              type="dashed"
              onClick={sendOTP}
              disabled={otpSent}
              style={{ marginBottom: 16 }}
            >
              Gửi mã OTP
            </Button>
            <div id="recaptcha-container"></div>
            {otpSent && (
              <>
                <Form.Item label="Mã OTP">
                  <Input
                    placeholder="Nhập mã OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={{ marginBottom: 12 }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={verifyOTP}
                  loading={verifying}
                  style={{ marginBottom: 24 }}
                >
                  Xác minh OTP
                </Button>
              </>
            )}

            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item label="Province" name="province" rules={[{ required: true, message: "Chọn tỉnh/thành phố" }]}>
              <Select
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                onChange={handleProvinceChange}
                loading={provinceList.length === 0}
                value={provinceId || undefined}
                optionFilterProp="children"
              >
                {provinceList.map(item => (
                  <Select.Option key={item.ProvinceID} value={item.ProvinceID}>
                    {item.ProvinceName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="District" name="district" rules={[{ required: true, message: "Chọn quận/huyện" }]}>
              <Select
                showSearch
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                loading={provinceId && districtList.length === 0}
                value={districtId}
                disabled={!provinceId}
                optionFilterProp="children"
              >
                {districtList.map(item => (
                  <Select.Option key={item.DistrictID} value={item.DistrictID}>
                    {item.DistrictName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Ward" name="wardCode" rules={[{ required: true, message: "Chọn phường/xã" }]}>
              <Select
                showSearch
                placeholder="Chọn phường/xã"
                loading={districtId && wardList.length === 0}
                disabled={!districtId}
                value={wardCode || undefined}
                optionFilterProp="children"
                onChange={value => setWardCode(value)}
              >
                {wardList.map(item => (
                  <Select.Option key={item.WardCode} value={String(item.WardCode)}>
                    {item.WardName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Tên ngân hàng" name="bankName">
              <Input placeholder="Nhập tên ngân hàng" />
            </Form.Item>
            <Form.Item label="Số tài khoản ngân hàng" name="bankAccountNumber">
              <Input placeholder="Nhập số tài khoản ngân hàng" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "100%",
                  background: "#111",
                  borderColor: "#111",
                  fontWeight: 600,
                  height: 40,
                }}
              >
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default EditInfo;