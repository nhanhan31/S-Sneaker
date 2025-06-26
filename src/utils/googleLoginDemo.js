// Demo Google OAuth API Response
// File này chỉ để tham khảo cấu trúc response từ API

export const DEMO_GOOGLE_LOGIN_RESPONSE = {
  // Response thành công
  success: {
    errCode: 0,
    errMessage: "Google login successful",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: 1,
      email: "user@gmail.com",
      firstName: "John",
      lastName: "Doe",
      roleId: 1, // 1: Customer, 2-3: Admin, 4-5: Other roles
      avatar: "https://lh3.googleusercontent.com/...",
      createdAt: "2025-06-26T10:00:00.000Z"
    }
  },

  // Response lỗi
  error: {
    errCode: 1,
    errMessage: "Invalid Google token",
    data: null
  }
};

// Demo Google User Info từ googleapis
export const DEMO_GOOGLE_USER_INFO = {
  id: "123456789012345678901",
  email: "user@gmail.com",
  verified_email: true,
  name: "John Doe",
  given_name: "John",
  family_name: "Doe",
  picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
  locale: "en"
};

// Cách sử dụng trong backend (Node.js/Express example):
/*
app.post('/api/google-login', async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify token với Google
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
    });
    
    const googleUser = await response.json();
    
    if (!response.ok) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Invalid Google token"
      });
    }
    
    // Tìm hoặc tạo user trong database
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Tạo user mới từ Google info
      user = await User.create({
        email: googleUser.email,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        avatar: googleUser.picture,
        roleId: 1, // Default customer role
        isGoogleUser: true
      });
    }
    
    // Tạo JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      errCode: 0,
      errMessage: "Google login successful",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error"
    });
  }
});
*/
