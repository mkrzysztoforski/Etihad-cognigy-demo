import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './App.css';
  
function App() {
  const [searchParams] = useSearchParams();
  let userId = searchParams.get('userid');
  const sessionId = searchParams.get('sessionid');

  if (userId && userId[0] === " ") {
    userId = "+" + userId.slice(1);
  }

  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js";

    script.onload = async () => {
      const chat = await window.initWebchat(
        "https://endpoint-trial.cognigy.ai/10565c8ff6c59e1ce0bcc6fea8633d1f5ffd97ead8d871cc1c7a77249340efb5",
        {
          userId: userId || undefined,
          sessionId: sessionId || undefined,
          // sessionInfo: {
          //   customSessionId: sessionId || undefined
          // },
          settings: {
            disableLocalEcho: true,
            enableUnreadMessageBadge: true,
            enableAPI: true,
            // loadHistory: true
          }
        }
      );

      window.cognigyWebchat = chat;
      
      chat.open();
      chat.sendMessage("", {
        _event: "continue_conversation",
      });
    
      // chat.registerAnalyticsService((event) => {
      //   console.log("analytics event:", event);
      // });

      chat.client.on("output", (message) => {
        const messageData = message?.data;

        console.log("Received message:", message);
        console.log("Payload:", message?.data);

        if (messageData._event === "set_rtl" && typeof messageData.rtl === "boolean") {
          console.log("Setting RTL:", messageData.rtl);
          const webchatRoot = document.getElementsByClassName("webchat-root");
          const label = document.querySelector('label[for="webchatInputMessageInputInTextMode"]');

          if (label) {
            if (messageData.rtl) {
              label.innerText = "اكتب شيئًا";
              label.style.right = "0px";
              label.style.left = "unset";
              label.style.textAlign = "right";
            } else {
              label.innerText = "Type something...";
              label.style.right = "unset";
              label.style.left = "0px";
              label.style.textAlign = "left";
            }
          }

          if (webchatRoot.length) {
            Array.from(webchatRoot).forEach((element) => {
              if (messageData.rtl) {
                element.setAttribute("dir", "rtl");
                element.classList.add("rtl");
              } else {
                element.setAttribute("dir", "ltr");
                element.classList.remove("rtl");
              }
            });
          }
        }
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url('/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        position: 'relative'
      }}
    />
  );
}

export default App;
