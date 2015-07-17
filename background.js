// 监听发送请求
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log(details);
    // 弹出通知
    chrome.notifications.clear("newNotice", function( wasClear ) {
  		chrome.notifications.create("newNotice", {
				type: "basic",
				iconUrl: chrome.runtime.getURL("images/logo.png"),
				title: "页面JS拦截提醒",
				message: "拓展将开启页面JS拦截，若要恢复js执行请关闭拓展。"
			}, function( notificationId ) {
				console.log(notificationId);
			} );
    });
    return {redirectUrl: chrome.extension.getURL("returnjs.js")};
  },
  {
    urls: [
    	"*://*.jquery.top/*",
      "*://*.baidu.com/*"
    ],
    types: ["script"]
  },
  ["blocking"]
);