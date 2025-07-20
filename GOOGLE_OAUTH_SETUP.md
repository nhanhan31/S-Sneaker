# Hướng dẫn cấu hình Google OAuth2.0

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Đặt tên project: "S-Sneaker OAuth"

## 2. Cấu hình OAuth Consent Screen

1. Vào **APIs & Services** > **OAuth consent screen**
2. Chọn **External** (nếu app chưa được verify)
3. Điền thông tin cơ bản:
   - App name: `S-Sneaker`
   - User support email: email của bạn
   - Developer contact information: email của bạn
4. Click **Save and Continue**
5. Trong **Scopes**, thêm:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
6. Click **Save and Continue**

## 3. Tạo OAuth 2.0 Client ID

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: `S-Sneaker Web Client`
5. **Authorized JavaScript origins**:
   - `http://localhost:3002` (cho development)
   - `https://yourdomain.com` (cho production)
6. **Authorized redirect URIs**:
   - `http://localhost:3002` (cho development)
   - `https://yourdomain.com` (cho production)
7. Click **Create**

## 4. Cấu hình Client ID trong ứng dụng

1. Copy **Client ID** từ Google Cloud Console
2. Mở file `src/config/googleConfig.js`
3. Thay thế `YOUR_GOOGLE_CLIENT_ID_HERE` bằng Client ID thực tế:

```javascript
export const GOOGLE_CLIENT_ID = "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com";
```

## 5. Cấu hình Backend API

Backend cần xử lý endpoint `/api/google-login` với:

**Request:**
```json
{
  "tokenId": "google_access_token_here"
}
```

**Response thành công:**
```json
{
  "errCode": 0,
  "errMessage": "Success",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "roleId": 1
  }
}
```

## 6. Test và Troubleshooting

### Lỗi thường gặp:

1. **"Origin not allowed"**: Kiểm tra Authorized JavaScript origins
2. **"redirect_uri_mismatch"**: Kiểm tra Authorized redirect URIs
3. **"invalid_client"**: Kiểm tra Client ID đã được copy đúng

### Test flow:

1. Click "Đăng nhập với Google"
2. Popup Google login sẽ xuất hiện
3. Chọn tài khoản Google
4. Approve permissions
5. Được chuyển hướng về trang chủ hoặc admin dashboard

## 7. Production Deployment

Khi deploy production:

1. Thêm domain production vào Authorized origins
2. Cập nhật `GOOGLE_CLIENT_ID` cho environment production
3. Đảm bảo HTTPS cho domain production

## Notes

- Access token từ Google sẽ được gửi tới backend API `/api/google-login`
- Backend phải verify token với Google API và tạo JWT token cho ứng dụng
- User sẽ được redirect dựa trên `roleId` trả về từ API
