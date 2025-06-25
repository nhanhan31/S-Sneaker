import { useEffect } from "react";

const FacebookMessengerChat = () => {
  useEffect(() => {
    // Load SDK Facebook
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    };

    // Inject SDK script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Facebook Messenger Plugin */}
      <div id="fb-root"></div>

      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id="YOUR_PAGE_ID" // 🔁 Thay bằng ID trang của bạn
        theme_color="#0084FF"
        logged_in_greeting="Xin chào! Bạn cần hỗ trợ gì không?"
        logged_out_greeting="Xin chào! Hãy đăng nhập để chat với chúng tôi nhé!"
      ></div>
    </>
  );
};

export default FacebookMessengerChat;
