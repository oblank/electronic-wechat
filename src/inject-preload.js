"use strict";
const ipcRenderer = require('electron').ipcRenderer;
const webFrame = require('web-frame');
const menu = require('./menu.js');

const lock = (object, key, value) => Object.defineProperty(object, key, {
  get: () => value,
  set: () => {
  }
});

webFrame.setZoomLevelLimits(1, 1);

lock(window, 'console', window.console);

let angular = window.angular = {};
let angularBootstrapReal;
Object.defineProperty(angular, 'bootstrap', {
  get: () => angularBootstrapReal ? function (element, moduleNames) {
    const moduleName = 'webwxApp';
    if (moduleNames.indexOf(moduleName) >= 0) {
      let constants;
      angular.injector(['ng', 'Services']).invoke(['confFactory', (confFactory) => (constants = confFactory)]);
      angular.module(moduleName).config([
        '$httpProvider',
        ($httpProvider) => {
          $httpProvider.defaults.transformResponse.push((value) => {
            if (typeof value === 'object' && value !== null && value.AddMsgList instanceof Array) {
              value.AddMsgList.forEach((msg) => {
                switch (msg.MsgType) {
                  case constants.MSGTYPE_EMOTICON:
                    lock(msg, 'MMDigest', '[Emoticon]');
                    lock(msg, 'MsgType', constants.MSGTYPE_EMOTICON);
                    break;
                  case constants.MSGTYPE_RECALLED:
                    lock(msg, 'MsgType', constants.MSGTYPE_SYS);
                    lock(msg, 'MMActualContent', '阻止了一次撤回');
                    lock(msg, 'MMDigest', '阻止了一次撤回');
                    break;
                }
              });
            }
            return value;
          });
        }
      ]);
    }
    return angularBootstrapReal.apply(angular, arguments);
  } : angularBootstrapReal,
  set: (real) => (angularBootstrapReal = real)
});

window.injectBundle = {};
injectBundle.getBadgeJS = () => {
  setInterval(() => {
    var count = 0;
    $(".icon.web_wechat_reddot_middle").each(function () {
      count += parseInt(this.textContent);
    });
    if (count > 0) {
      ipcRenderer.send("badge-changed", count.toString());
    } else {
      ipcRenderer.send("badge-changed", "");
    }
  }, 1500);
};

injectBundle.appendMenu = () => {
  var curr_pos, title = "";
  var hash_tag = "微信好文分享";
  var menu, reader;
  setInterval(() => {
    reader = document.getElementById("reader");
    menu = reader ? document.getElementById("mmpop_reader_menu") : false;
    if (reader && menu) {
      title = $(".read_item.active .title").text();
      console.log(title);
      console.log(reader.src);
      if (!title || !reader.src) {
        return;
      }
      if ((curr_pos != reader.src) || ($(".reader_menu .dropdown_menu > li").length < 5)) {
        curr_pos = reader.src;
        var share_url = encodeURIComponent(reader.src);
        var share_title = encodeURIComponent(title);
        var title4weibo = encodeURIComponent(`${title} #${hash_tag}#`);
        var title4twitter = encodeURIComponent(`${title} #${hash_tag}`);
        var title4fb = title4twitter;
        //var html = reader.contentDocument.body.innerHTML;
        var share_weibo = `http://service.weibo.com/share/share.php?url=${share_url}&title=${title4weibo}#&searchPic=yes`;
        var share_twitter = `https://twitter.com/intent/tweet?text=${title4twitter}&url=${share_url}&original_referer=`;
        var share_email = `mailto:?&subject=${share_title}&body=${share_title}%0A${share_url}`;
        var share_qzone = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${share_url}&title=${share_title}&pics=&summary=`;
        var share_facebook = `https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D=${title4fb}&p%5Bsummary%5D=%21&p%5Burl%5D=${share_url}&p%5Bimages%5D=`;
        var menuHtml = `
          <li>
            <a href="javascript:;" target="_blank" onclick="javascript:window.open('${share_weibo}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              分享到微博
            </a>
          </li>
          <li>
            <a href="javascript:;" target="_blank" onclick="javascript:window.open('${share_twitter}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              分享到Twitter
            </a>
          </li>
          <li>
            <a href="javascript:;" target="_blank" onclick="javascript:window.open('${share_qzone}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              分享到QQ空间
            </a>
          </li>
          <li>
            <a href="javascript:;" target="_blank" onclick="javascript:window.open('${share_facebook}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              分享到FaceBook
            </a>
          </li>
          <li>
            <a href="javascript:;" target="_blank" onclick="javascript:window.open('${share_email}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              邮件分享
            </a>
          </li>
        `;
        $(".reader_menu .dropdown_menu").prepend(menuHtml);
      }
    }

  }, 500);

}

menu.create();
