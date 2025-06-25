import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BotpressChat = () => {
    const [loaded, setLoaded] = useState(false);
    const location = useLocation(); // detect route changes

    useEffect(() => {
        // Nếu đã load bot thì không load lại nữa
        if (window.botpressWebChat) {
            // Ở mỗi lần chuyển route thì hiển thị lại nếu cần
            window.botpressWebChat.sendEvent({ type: "show" });
            return;
        }

        // Inject inject.js script
        const injectScript = document.createElement("script");
        injectScript.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
        injectScript.defer = true;
        injectScript.onload = () => {
            // Sau khi inject thành công, inject config
            const configScript = document.createElement("script");
            configScript.src =
                "https://files.bpcontent.cloud/2025/06/25/13/20250625133837-KAS2CG5T.js";
            configScript.defer = true;
            configScript.onload = () => setLoaded(true);
            document.body.appendChild(configScript);
        };
        document.body.appendChild(injectScript);


        const enableDraggable = (event) => {
            if (event.data?.name === 'webchatLoaded') {
                window.botpressWebChat?.mergeConfig({
                    draggable: true
                });
                console.log("[Botpress] Draggable enabled");
                setLoading(false);
            }
        };

        window.addEventListener("message", enableDraggable);

        return () => {
            window.removeEventListener("message", enableDraggable);
        };
    }, []);

    return null; // không render gì lên UI
};

export default BotpressChat;
