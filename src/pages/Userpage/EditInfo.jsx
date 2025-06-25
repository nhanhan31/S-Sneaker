import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Spin, message, Typography } from "antd";
import { getProvinces, getDistricts, getWards } from "../../utils/ghnApi";
import { updateUser } from "../../utils/userApi"; // Đảm bảo đã import

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

  return (
    <div style={{ maxWidth: 600, margin: "0 20px", background: "#fff", padding: 32, borderRadius: 8,  display: "flex", justifyContent: "flex-start" }}>
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
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
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