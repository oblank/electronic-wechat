/**
 * Created by oBlank on 3/31/16.
 */
"use strict";

class ShareMenu {
  const hash_tag = "微信好文分享";

  get(link) {
    if (!link.url || !link.title) return "";

    link.weibo = encodeURIComponent(`${link.title} #${this.hash_tag}#`);
    link.tweet = encodeURIComponent(`${link.title} #${this.hash_tag}`);
    link.url = encodeURIComponent(link.url);
    link.title = encodeURIComponent(link.title);


    let shareTargets = {
      'weibo': {
        url: `http://service.weibo.com/share/share.php?url=${link.url}&title=${link.weibo}#&searchPic=yes`,
        text: '分享到微博'
      },
      'qzone': {
        url: `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${link.url}&title=${link.title}&pics=&summary=`,
        text: '分享到 QQ 空间'
      },
      'facebook': {
        url: `https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D=${link.title}&p%5Bsummary%5D=%21&p%5Burl%5D=${link.url}&p%5Bimages%5D=`,
        text: '分享到 Facebook'
      },
      'evernote': {
        url: `https://www.evernote.com/clip.action?url=${link.url}&title=${link.title}`,
        text: '分享到 Evernote'
      },
      'twitter': {
        url: `https://twitter.com/intent/tweet?text=${link.tweet}&url=${link.url}&original_referer=`,
        text: '分享到 Twitter'
      },
      'email': {
        url: `mailto:?&subject=${link.title}&body=${link.title}%0A${link.url}`,
        text: '分享到邮件'
      }
    };


    let menuItemsTemplate = ``;
    for (let target in shareTargets) {
      menuItemsTemplate += this.genShareMenuItem(shareTargets[target]);
    }

    return menuItemsTemplate;
  }

  genShareMenuItem(target) {
    return `
          <li>
            <a href="javascript:;" onclick="javascript:window.open('${target.url}', '_blank'); return;">
              <i class="menuicon_copylink"></i>
              ${target.text}
            </a>
          </li>
          `;
  }
}


module.exports = ShareMenu;