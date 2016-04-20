var MainLogic = {
    alllinks: [],
    visibleLinks: [],
    injecturl: "",
    $id: function(_id) {
        return document.getElementById(_id);
    },
    init: function() {
        document.addEventListener("DOMContentLoaded", MainLogic.domready, false);
    },

    //domready
    domready: function() {
        MainLogic.$id("filterValue").onkeyup = MainLogic.filterLinks;
        MainLogic.$id("save").onclick = MainLogic.downloadLinks;
        MainLogic.$id("injectNormal").onclick = MainLogic.getScript;
        MainLogic.$id("injectDatamain").onclick = MainLogic.injectRequire;
        MainLogic.$id("injectValue").onblur = MainLogic.setInjectUrl;
        chrome.windows.getCurrent(function(currentWindow) {
            //获取有指定属性的标签，为空获取全部标签
            chrome.tabs.query({
                active: true,
                windowId: currentWindow.id
            },
            function(activeTabs) {
                console.log("TabId:" + activeTabs[0].id);
                chrome.tabs.executeScript(activeTabs[0].id, {
                    file: "sendlink.js",
                    allFrames: false
                });
            });
        });
    },

    //显示检索到的脚本
    showLinks: function(l) {
        var linksWrap = MainLogic.$id("linkList");
        linksWrap.innerHTML = "";
        for (var i = 0,
        n = l.length; i < n; i++) {
            var li = document.createElement("li");
            var checkbox = document.createElement("input");
            var span = document.createElement("span");
            checkbox.checked = true;
            checkbox.type = "checkbox";
            checkbox.id = "cb" + i;
            span.innerText = l[i];
            span.title = l[i];
            li.appendChild(checkbox);
            li.appendChild(span);
            linksWrap.appendChild(li);
        }
        MainLogic.$id("jscount").innerText = l.length;
    },

    //下载所选链接
    downloadLinks: function() {
        for (var i = 0,
        n = MainLogic.visibleLinks.length; i < n; i++) {
            if (MainLogic.$id("cb" + i).checked) {
                chrome.downloads.download({
                    url: MainLogic.visibleLinks[i]
                });
            }
        }
        window.close();
    },

    filterLinks: function() {
        var filtervalue = MainLogic.$id("filterValue").value.trim();
        var visLinks = MainLogic.alllinks.filter(function(link) {
            return link.match(filtervalue);
        });
        MainLogic.showLinks(visLinks);
    },

    //获取远程脚本并进行普通注入
    getScript: function() {
        MainLogic.setInjectUrl();
        var url = MainLogic.injecturl;
        if (url) {
            $("#injectValue").removeClass("errbox");
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var code = xhr.responseText;
                        console.log(code);
                        chrome.tabs.executeScript(null, {
                            code: code,
                            allFrames: false
                        },
                        function() {
                            console.log("executeScript success!!!!!!!!!");
                        });
                    } else {
                        $('#xhr-errbox').show();
                        setTimeout(function() {
                            $('#xhr-errbox').hide();
                        },
                        2000);
                    }
                }
            }
            var ts = new Date().getTime();
            var u;
            if (url.indexOf('?') === -1) {
                u = url + '?_t=' + ts;
            } else {
                u = url + '&_t=' + ts;
            }
            xhr.open('GET', u, true);
            xhr.send(null);
        } else {
            $("#injectValue").addClass("errbox");
            MainLogic.msgBox("远程脚本不能为空！");
        }
    },

    //设置注入url
    setInjectUrl: function() {
        MainLogic.injecturl = MainLogic.$id("injectValue").value.trim();
        MainLogic.$id("injectValue").setAttribute("data-inject", MainLogic.injecturl);
    },

    // 执行注入requirejs
    injectRequire: function() {
        MainLogic.setInjectUrl();
        var requireurl = chrome.extension.getURL("require.js");
        var datamainjs = MainLogic.injecturl;
        if (datamainjs) {
            var executeCode = '' + 'var scripts = document.getElementsByTagName("script");' + '[].forEach.call(scripts, function(script) {' + '  if(!!script.src && script.src == "' + requireurl + '"){' + '    script.parentNode.removeChild(script);' + '  }' + '});' + 'var Req_script = document.createElement("script");' + 'Req_script.src = "' + requireurl + '";' + 'Req_script.setAttribute("data-main","' + datamainjs + '");' + 'document.body.appendChild(Req_script);';
            chrome.tabs.executeScript(null, {
                code: executeCode
            });
            MainLogic.msgBox("已成功注入！");
        } else {
            $("#injectValue").addClass("errbox");
            MainLogic.msgBox("远程脚本不能为空！");
        }
    },

    // show messagebox
    msgBox: function(str) {
        var timer = null;
        $('#xhr-errbox').html(str) $('#xhr-errbox').show();
        timer = setTimeout(function() {
            $('#xhr-errbox').hide();
            clearTimeout(timer);
        },
        2000);
    }
};

chrome.extension.onMessage.addListener(function(links) {
    for (var index in links) {
        MainLogic.alllinks.push(links[index]);
    }
    MainLogic.alllinks.sort();
    MainLogic.visibleLinks = MainLogic.alllinks;
    MainLogic.showLinks(MainLogic.visibleLinks);
});

MainLogic.init();