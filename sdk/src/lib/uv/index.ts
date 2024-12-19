import { postData } from "../request";
function getUserIdentifier() {
  let userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem("userId", userId);
  }
  if (token) {
    return undefined;
  } else {
    return userId;
  }
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function recordDailyVisit(options: { api: any }) {
  const api = options.api;
  const userId = getUserIdentifier();
  const pageUrl = window.location.href;
  
  // 发送请求记录访问
  postData(api, {
    pageUrl: pageUrl,
    userId: userId,
  })
    .then((response) => {
      console.log("Daily visit recorded:", response.data);
    })
    .catch((error) => {
      console.error("Error recording daily visit:", error);
    });
}
export { recordDailyVisit };
