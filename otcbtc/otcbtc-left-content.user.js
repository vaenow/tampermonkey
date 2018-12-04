// ==UserScript==
// @name         otcbtc-侧边成交时间
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://otcbtc.io/sell_offers*
// @match        https://otcbtc.io/buy_offers*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    layout()
    syncDateTime()
    sortByTradeTime()

})();

function layout() {
    $('.otc-trade-history-title').html('【商户】'+$('.otc-trade-history-title').html())
    $('.otc-trade-history').css({'font-size': '10px'})
    $('.otc-trade-history-head .otc-trade-history-total-price').html('金额')
    $('.otc-trade-history-head .otc-trade-history-right-icon').html('商户')
    $('.otc-trade-history-head .otc-trade-history-currency').css({'text-align': 'center'})
    $('.otc-trade-history-total-price').css({width: '20%'})
    $('.otc-trade-history-right-icon').css({width: '11%'})
    $('.otc-trade-history-amount').css({width: '22%', 'text-align':'right', 'margin-right': '2%'})
    $('.otc-trade-history-currency').css({width: '45%'})
}

function sortByTradeTime() {
    $('.otc-trade-history .otc-trade-history-content').sort(function(a,b) {
        return $(a).attr('trade-time') > $(b).attr('trade-time') ? -1 : 1
    }).appendTo('.otc-trade-history');
}

/*
0: ""
1: "1,525"
2: "=>"
3: "0.0562"
4: "BTC"
5: ""
*/
function syncDateTime() {
    const preTrades = JSON.parse(localStorage.getItem('trades')||"{}")
    let trades = {}
    $('.otc-trade-history .otc-trade-history-content').each((i, e)=> {
        const k = $(e)
        .text()
        .replace(/\s+/g, '#')
        .replace(/_\d{2}:\d{2}/g, '')
        .split(/#/g)
        const a = k.join('')

        // 交易时间
        trades[a] = preTrades[a] ? preTrades[a] : moment().format('HH:mm')
        $(e).attr('trade-time', +trades[a].match(/\d+/g).join(''))

        // 交易单价
        const dealPrice = (k[1].replace(/,/,'') / k[3]).toFixed(2)

        // 添加交易时间，交易单价
        const el = $(e).find('.otc-trade-history-currency')
        const content = `${el.html()}_${trades[a]}_￥${dealPrice}`
        const isBuySide = !!$(e).find('.otc-trade-history-right-icon.buy').length
        const symbol = $(e).find('.otc-trade-history-currency').text().match(/[A-Z]{3,}/g)[0]
        const dom = $(`<a href='/${isBuySide?'sell':'buy'}_offers?currency=${symbol.toLowerCase()}&fiat_currency=cny&payment_type=all'>${content}</a>`)
        dom.css({color: 'inherit'})
        el.html(dom)

        // 改变箭头
        $(e).find('.otc-trade-history-right-icon.buy').html('卖')
        $(e).find('.otc-trade-history-right-icon.sell').html('买')

        // 格式化数量
        const amount = $(e).find('.otc-trade-history-amount')
        amount.html((+amount.html()).toFixed(2))
    })
    localStorage.setItem('trades', JSON.stringify(trades))
    // console.log(trades)
    return trades
}
