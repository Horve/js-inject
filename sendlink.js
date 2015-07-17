var links1 = document.getElementsByTagName("script"),
	// links2 = document.getElementsByTagName("link"),
	links2 = [];
	arr = [];
[].forEach.call(links1, function(el) {
	var href = el.src;
	if(/[http|https]:\/\//gi.test(href)){
		arr.push(href);
	}
});
[].forEach.call(links2, function(el) {
	var href = el.href;
	if(/[http|https]:\/\//gi.test(href)){
		arr.push(href);
	}
});

arr.sort();
window.name = arr;
chrome.extension.sendMessage(arr);
