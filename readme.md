## Elong_javascript_inject v1.0.0
### chrome浏览器拓展——js脚本拦截及注入

### 概要

该浏览器拓展插件是拥有为页面拦截和注入js功能的chrome浏览器扩展，可以拦截页面脚本、检索页面脚本文件、下载页面脚本文件、为页面注入js文件，以及为页面注入requirejs和requirejs入口文件。

### 安装方式

#### 拓展为开发版本，尚未打包发布，安装时需要将项目文件更新到本地，具体如下：

- 1，更新项目到本地目录，如：/users/js_inject
    
- 2，在chrome浏览器中打开 chrome://extensions/ 

- 3，点击“加载正在开发的拓展程序”按钮

- 4，选择/users/js_inject目录，确定

- 5，浏览器地址栏右边的艺龙logo小图标，即为拓展插件的入口

### 自定义

#### 在本版插件中，预设了一些默认设定，可以根据实际需求进行修改。功能点、配置文件位置、如何修改详情如下：

#### 1，配置需要开启js拦截功能的站点域名。“background.js” 文件中的如下位置：

    urls: [
    	"*://*.jquery.top/*", //域名过滤器，*://*/* 表示所有协议、所有域名、域名下的所有资源均匹配 
        "*://*.baidu.com/*"
    ],

#### 2，配置拓展启动时需要向页面注入的资源。“manifest.json” 文件中的如下位置：

    "content_scripts": [
		{
			"matches": ["http://*/*"], //域名过滤器
			"js": ["jquery-1.9.1.js"], //需要向页面中注入的脚本资源
			"run_at": "document_end"   //注入时机，该选项表明是文档节点加载完成后注入
		}
	],

#### 3，配置拓展包内资源引用权限。“manifest.json” 文件中的如下位置：

    "web_accessible_resources": [
		"require.js",
		"returnjs.js",
		"images/*"
	]

### 使用方式

#### 1，js脚本检索功能

打开拓展界面后，即会加载出页面中所有引用的外部js脚本列表，可以通过“检索URL”输入框对脚本关键字进行检索。

#### 2，下载选中脚本

点击“下载选中脚本”按钮可以下载已经选中的检索出的脚本文件。

#### 3，向页面中注入指定脚本（远程脚本）

3.1  普通注入方式

普通注入方式将直接向页面中注入在“脚本URL”文本框中输入的远程脚本并立即执行。

3.2 requirejs入口脚本方式注入

该方式将首先向页面注入require.js，随后将把“脚本URL”文本框中输入的远程脚本作为requirejs的入口脚本执行。

### 外部API资源文档

360极速浏览器开放平台（chrome官方API的中文版本，但不是最新）： http://open.chrome.360.cn/extension_dev/overview.html

chrome插件中文开发文档（非官方，与官方文档一致，不用翻墙）： http://chrome.liuyixi.com/overview.html

Chrome扩展及应用开发（电子书）： http://www.ituring.com.cn/book/1472

