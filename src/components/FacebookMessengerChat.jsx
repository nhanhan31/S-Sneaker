import { useEffect } from "react";

const FacebookMessengerChat = () => {
  useEffect(() => {
    // Chỉ load SDK nếu chưa có
    if (!window.FB && !document.getElementById("facebook-jssdk")) {
      
      // Định nghĩa fbAsyncInit trước khi load script
      window.fbAsyncInit = function () {
        window.FB.init({
          xfbml: true,
          version: "v19.0"
        });
        
        // Debug log
        console.log('Facebook SDK loaded successfully');
        
        // Subscribe to events để debug
        FB.Event.subscribe('customerchat.load', function() {
          console.log('Customer Chat loaded');
        });
        
        FB.Event.subscribe('customerchat.show', function() {
          console.log('Customer Chat shown');
        });
        
        // Parse lại các plugin sau khi SDK ready
        setTimeout(() => {
          if (window.FB && window.FB.XFBML) {
            window.FB.XFBML.parse();
          }
        }, 1000);
      };

      // Tạo và load script
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      // Thêm script vào head thay vì body
      document.head.appendChild(script);
    } else if (window.FB && window.FB.XFBML) {
      // Nếu SDK đã có, parse lại
      window.FB.XFBML.parse();
    }

    // Cleanup function
    return () => {
      // Không remove script để tránh conflict khi component re-mount
    };
  }, []);

  return (
    <>
      {/* Facebook Customer Chat Plugin */}
      <div
        className="fb-customerchat"
        attribution="biz_inbox"
        page_id="686096481255419"
        theme_color="#0084FF"
        logged_in_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn về sản phẩm sneakers?"
        logged_out_greeting="Xin chào! Hãy để lại tin nhắn và chúng tôi sẽ phản hồi sớm nhất."
        greeting_dialog_display="show"
        greeting_dialog_delay="3"
      />
    </>
  );
};

export default FacebookMessengerChat;
