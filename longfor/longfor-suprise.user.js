// ==UserScript==
// @name         龙湖抽奖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://m.iguanyu.com/fe/marketing/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @updateURL    http://vaenow.github.io/tampermonkey/longfor/longfor-suprise.user.js
// ==/UserScript==

(async function() {
    'use strict';

    // 自动点击
    await delay(2e3)
    $('.jiugongge-list.button').click()

    // 获取抽奖状态
    await delay(2e3)
    setInterval(() => $('.bingoInfo p').html($('.tips').text()), 500)

    // 重来
    if($('.tips').text().match(/房租|樊登|喜马拉雅/)) {
        deleteAllCookies()
        localStorage.clear()
        await delay(5e3)
        location.reload()
    }

})();

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
// 延迟
function delay(timeout = 2 * 1000) {
    return new Promise((yes) => {
        setTimeout(yes, timeout)
    })
}