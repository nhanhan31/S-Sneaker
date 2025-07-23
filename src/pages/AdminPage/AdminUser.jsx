import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Input,
    Space,
    Modal,
    Form,
    Select,
    message,
    Tag,
    Avatar,
    Tooltip,
    Card,
    Row,
    Col,
    Typography,
    Divider,
    Spin
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { getAllUsers, getUserDetail, createUser, updateUser, updateUserActiveStatus } from '../../utils/userApi';
import { getAllRoles } from '../../utils/roleApi';
import { getProvinces, getDistricts, getWards } from "../../utils/ghnApi";
import { getOrdersByUserId } from "../../utils/orderApi"; // Import API lấy đơn hàng

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [detailForm] = Form.useForm();
    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [provinceId, setProvinceId] = useState(null);
    const [districtId, setDistrictId] = useState(null);
    const [wardCode, setWardCode] = useState('');
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(false);

    const token = localStorage.getItem('token');

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await getAllUsers(token);
            if (result.ok) {
                setUsers(result.data.users || []);
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    // Fetch roles
    const fetchRoles = async () => {
        try {
            const result = await getAllRoles(token);
            if (result.ok) {
                setRoles(result.data.role || []); // API trả về 'role' không phải 'roles'
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải danh sách vai trò!");
        }
    };

    const fetchLocationData = async (user) => {
        try {
            const provinces = await getProvinces();
            if (provinces.ok && Array.isArray(provinces.data.data)) {
                setProvinceList(provinces.data.data);
                const province = provinces.data.data.find(
                    (p) => p.ProvinceID === Number(user.province)
                );
                detailForm.setFieldsValue({
                    province: province?.ProvinceID,
                });

                const districts = await getDistricts(province?.ProvinceID);
                if (districts.ok && Array.isArray(districts.data.data)) {
                    setDistrictList(districts.data.data);
                    const district = districts.data.data.find(
                        (d) => d.DistrictID === Number(user.district)
                    );
                    detailForm.setFieldsValue({
                        district: district?.DistrictID,
                    });

                    const wards = await getWards(district?.DistrictID);
                    if (wards.ok && Array.isArray(wards.data.data)) {
                        setWardList(wards.data.data);
                        const ward = wards.data.data.find(
                            (w) => w.WardCode === String(user.wardCode)
                        );
                        detailForm.setFieldsValue({
                            wardCode: ward?.WardCode,
                        });
                    }
                }
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải dữ liệu địa phương!");
        }
    };

    // Khi chọn tỉnh/thành phố
    const handleProvinceChange = async (value) => {
        const id = Number(value);
        setProvinceId(id);
        detailForm.setFieldsValue({ province: id, district: undefined, wardCode: undefined });
        setDistrictList([]);
        setWardList([]);
        setDistrictId(null);
        setWardCode(null);

        try {
            const districts = await getDistricts(id);
            if (districts.ok && Array.isArray(districts.data.data)) {
                setDistrictList(districts.data.data);
            }
        } catch {
            message.error("Có lỗi xảy ra khi tải danh sách quận/huyện!");
        }
    };

    // Khi chọn quận/huyện
    const handleDistrictChange = async (value) => {
        const id = Number(value);
        setDistrictId(id);
        detailForm.setFieldsValue({ district: id, wardCode: undefined });
        setWardList([]);
        setWardCode(null);

        try {
            const wards = await getWards(id);
            if (wards.ok && Array.isArray(wards.data.data)) {
                setWardList(wards.data.data);
            }
        } catch {
            message.error("Có lỗi xảy ra khi tải danh sách phường/xã!");
        }
    };

    // Fetch user detail
    const fetchUserDetail = async (userId) => {
        try {
            const result = await getUserDetail(userId, token);
            if (result.ok) {
                const user = result.data.user;
                setSelectedUser(user);
                detailForm.setFieldsValue(user);
                await fetchLocationData(user); // Gọi API tỉnh/thành phố, quận/huyện, phường/xã
                setDetailModalVisible(true);
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tải thông tin người dùng!");
        }
    };

    // Create user
    const handleCreateUser = async (values) => {
        try {
            const result = await createUser(values, token);
            if (result.ok) {
                message.success("Tạo người dùng thành công!");
                setCreateModalVisible(false);
                form.resetFields();
                fetchUsers();
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo người dùng!");
        }
    };

    // Update user
    const handleUpdateUser = async (values) => {
        try {
            const result = await updateUser(selectedUser.userId, values, token);
            if (result.ok) {
                message.success("Cập nhật người dùng thành công!");
                setDetailModalVisible(false);
                fetchUsers();
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật người dùng!");
        }
    };

    // Toggle active status
    const handleToggleActiveStatus = async () => {
        try {
            const newStatus = !selectedUser.isActive; // Đảo ngược trạng thái hiện tại
            const result = await updateUserActiveStatus(selectedUser.userId, newStatus, token);
            if (result.ok) {
                message.success("Cập nhật trạng thái hoạt động thành công!");
                setSelectedUser({ ...selectedUser, isActive: newStatus }); // Cập nhật trạng thái trong UI
                fetchUsers(); // Làm mới danh sách người dùng
            } else {
                message.error(result.data.errMessage);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật trạng thái hoạt động!");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    // Filter users
    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );

    // Role colors
    const getRoleColor = (roleId) => {
        const role = roles.find(r => r.roleId === roleId);
        if (role) {
            switch (role.code?.toUpperCase()) {
                case 'ADMIN': return 'red';
                case 'STAFF': return 'orange';
                case 'CUSTOMER': return 'blue';
                default: return 'default';
            }
        }
        // Fallback for old logic
        switch (roleId) {
            case 1: return 'blue';
            case 2: return 'orange';
            case 3: return 'red';
            default: return 'default';
        }
    };

    const getRoleText = (roleId) => {
        const role = roles.find(r => r.roleId === roleId);
        if (role) {
            return role.description;
        }
        // Fallback for old logic
        switch (roleId) {
            case 1: return 'Khách hàng';
            case 2: return 'Staff';
            case 3: return 'Admin';
            default: return 'Khác';
        }
    };


    const columns = [
        {
            title: '#',
            dataIndex: 'userId',
            key: 'userId',
            width: 80,
            render: (id) => <Text strong>#{id}</Text>
        },
        {
            title: 'Người dùng',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <div>
                        <div style={{ fontWeight: 600 }}>
                            {record.firstName} {record.lastName}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <Space>
                    <MailOutlined style={{ color: '#1890ff' }} />
                    <Text copyable>{email}</Text>
                </Space>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => fetchUserDetail(record.userId)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];


    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, color: '#111' }}>
                    Quản lý người dùng
                </Title>
                <Text type="secondary">
                    Quản lý thông tin và quyền hạn của người dùng trong hệ thống
                </Text>
            </div>

            <Card>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            allowClear
                            size="large"
                            onSearch={setSearchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} offset={8} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => setCreateModalVisible(true)}
                            style={{
                                background: '#111',
                                borderColor: '#111',
                                borderRadius: 8,
                                fontWeight: 600
                            }}
                        >
                            Thêm người dùng
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="userId"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} người dùng`,
                    }}
                    scroll={{ x: 800 }}
                    style={{
                        borderRadius: 8,
                        overflow: 'hidden'
                    }}
                />
            </Card>

            {/* Create User Modal */}
            <Modal
                title="Thêm người dùng mới"
                open={createModalVisible}
                onCancel={() => {
                    setCreateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateUser}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="Họ"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Nhập họ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Nhập tên" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="roleId"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            >
                                <Select placeholder="Chọn vai trò">
                                    {roles.map(role => (
                                        <Option key={role.roleId} value={role.roleId}>
                                            {role.description}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: 'right', marginTop: 24 }}>
                        <Space>
                            <Button onClick={() => {
                                setCreateModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                            <Button htmlType="submit">
                                Tạo người dùng
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* User Detail Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar src={selectedUser?.image} icon={<UserOutlined />} size={40} />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>
                                {selectedUser?.firstName} {selectedUser?.lastName}
                            </div>
                            <Text type="secondary">{selectedUser?.email}</Text>
                        </div>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedUser && (
                    <div>
                        <Divider />

                        {/* User Info Cards */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col span={8}>
                                <Card size="small">
                                    <div style={{ textAlign: 'center' }}>
                                        <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                        <div style={{ marginTop: 8, fontWeight: 600 }}>
                                            ID: #{selectedUser.userId}
                                        </div>
                                        <Text type="secondary">Mã người dùng</Text>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <div style={{ textAlign: 'center' }}>
                                        <Tag color={getRoleColor(selectedUser.roleId)} style={{ fontSize: 12 }}>
                                            {getRoleText(selectedUser.roleId)}
                                        </Tag>
                                        <div style={{ marginTop: 8, fontWeight: 600 }}>
                                            Vai trò
                                        </div>
                                        <Text type="secondary">{selectedUser.role?.description}</Text>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card size="small">
                                    <div style={{ textAlign: 'center' }}>
                                        <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                                            {selectedUser.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </Tag>
                                        <div style={{ marginTop: 8, fontWeight: 600 }}>
                                            Trạng thái
                                            <Button
                                                danger={!selectedUser.isActive}
                                                onClick={handleToggleActiveStatus}
                                                style={{ marginTop: 12 }}
                                            >
                                                {selectedUser.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                                            </Button>
                                        </div>
                                        <Text type="secondary">
                                            {selectedUser.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                                        </Text>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Form
                            form={detailForm}
                            layout="vertical"
                            onFinish={handleUpdateUser}
                        >
                            <Title level={4}>Thông tin cá nhân</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        label="Họ"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                                    >
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        label="Tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                    >
                                        <Input prefix={<UserOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="email" label="Email">
                                        <Input prefix={<MailOutlined />} disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="phoneNumber" label="Số điện thoại">
                                        <Input prefix={<PhoneOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Title level={4}>Địa chỉ</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="province"
                                        label="Tỉnh/Thành phố"
                                        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn tỉnh/thành phố"
                                            onChange={handleProvinceChange}
                                        >
                                            {provinceList.map((province) => (
                                                <Option key={province.ProvinceID} value={province.ProvinceID}>
                                                    {province.ProvinceName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="district"
                                        label="Quận/Huyện"
                                        rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                                    >
                                        <Select
                                            placeholder="Chọn quận/huyện"
                                            onChange={handleDistrictChange}
                                            disabled={!provinceId}
                                        >
                                            {districtList.map((district) => (
                                                <Option key={district.DistrictID} value={district.DistrictID}>
                                                    {district.DistrictName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="wardCode"
                                        label="Phường/Xã"
                                        rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                                    >
                                        <Select placeholder="Chọn phường/xã" disabled={!districtId}>
                                            {wardList.map((ward) => (
                                                <Option key={ward.WardCode} value={ward.WardCode}>
                                                    {ward.WardName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="address" label="Địa chỉ cụ thể">
                                        <Input placeholder="Nhập địa chỉ cụ thể" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Title level={4}>Thông tin ngân hàng</Title>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="bankAccountNumber" label="Số tài khoản">
                                        <Input prefix={<BankOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="bankName" label="Tên ngân hàng">
                                        <Input prefix={<BankOutlined />} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div style={{ textAlign: 'right', marginTop: 24 }}>
                                <Space>
                                    <Button onClick={() => setDetailModalVisible(false)}>
                                        Hủy
                                    </Button>
                                    <Button
                                        htmlType="submit"
                                        icon={<EditOutlined />}
                                    >
                                        Cập nhật
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminUser;