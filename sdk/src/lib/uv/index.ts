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

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
}
function recordDailyVisit(options: { api: any }) {
  const api = options.api;
  const userId = getUserIdentifier();
  const today = getTodayDate();
  const lastVisitDate = localStorage.getItem("lastVisitDate");

  // 如果今天还没有记录过访问
  if (lastVisitDate !== today) {
    const pageUrl = window.location.href;
    // 发送请求记录访问
    postData(api, {
      pageUrl: pageUrl,
      userId: userId,
    })
      .then((response) => {
        console.log("Daily visit recorded:", response.data);
        // 更新最后访问日期
        localStorage.setItem("lastVisitDate", today);
      })
      .catch((error) => {
        console.error("Error recording daily visit:", error);
      });
  }
}
export { recordDailyVisit };
