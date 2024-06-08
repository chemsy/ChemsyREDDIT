const fetch = require('node-fetch');
const {
    faker
} = require('@faker-js/faker');
const cheerio = require('cheerio');
const {
    HttpsProxyAgent
} = require('https-proxy-agent');
const delay = require('delay');
const {
    encodeBase64,
    ethers,
    Wallet
} = require('ethers');
const fs = require('fs');
var chalk = require("chalk");
const dotenv = require('dotenv')
const path = require('path');
dotenv.config({
    path: `configReddit.env`
});
const {
    table
} = require('table');
const readlineSync = require("readline-sync");
var machineIdSync = require('node-unique-machine-id');
if (fs.existsSync('loginReddit.json')) {} else {
    fs.appendFileSync("loginReddit.json", '[]');
}
var configData = fs.readFileSync(`loginReddit.json`);
var config = JSON.parse(configData)
const detect = config;
var totalAccount = config.length;

var keyCaptcha = process.env.keyCaptcha
var proxyMu = process.env.proxy
var password = process.env.password
var domain = process.env.domain

function checkIP() {
    const index = fetch('http://api.ipify.org', {
        agent: new HttpsProxyAgent('http://IFd0dCioL1LkJwrE:Jancok123@geo.iproyal.com:12321'),
            method: 'GET'
        })
        .then(async res => {
            const data = await res.text()
            return data;
        })
    return index
}

function comment(csrf, cookie, proxyMu, postId, commentku) {
    const index = fetch('https://www.reddit.com/svc/shreddit/t3_' + postId + '/create-comment', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Accept': 'text/vnd.reddit.partial+html, application/json',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=1',
                'Te': 'trailers',
                'Cookie': 'csrf_token=' + csrf + '; ' + cookie + ''
            },
            body: new URLSearchParams({
                'content': '{"document":[{"e":"par","c":[{"e":"text","t":"' + commentku + '","f":[[0,0,6]]}]}]}',
                'mode': 'richText',
                'richTextMedia': '[]',
                'csrf_token': csrf
            })
        })

        .then(async res => {
            const data = await res.text()
            return data;
        })
    return index
}

function autoUpVote(csrf, cookie, proxyMu, postId) {
    const index = fetch('https://www.reddit.com/svc/shreddit/graphql', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Accept': 'text/vnd.reddit.partial+html, application/json',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=1',
                'Te': 'trailers',
                'Cookie': 'csrf_token=' + csrf + '; ' + cookie + ''
            },
            body: JSON.stringify({
                'operation': 'UpdatePostVoteState',
                'variables': {
                    'input': {
                        'postId': `t3_${postId}`,
                        'voteState': 'UP'
                    }
                },
                'csrf_token': csrf
            })
        })

        .then(async res => {
            const data = await res.json()
            return data;
        })
    return index
}

function autoPost(csrf, cookie, proxyMu, title, body) {
    const index = fetch('https://www.reddit.com/svc/shreddit/graphql', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Accept': 'text/vnd.reddit.partial+html, application/json',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=1',
                'Te': 'trailers',
                'Cookie': 'csrf_token=' + csrf + '; ' + cookie + ''
            },
            body: JSON.stringify({
                'csrf_token': csrf,
                'operation': 'CreateProfilePost',
                'variables': {
                    'input': {
                        'isNsfw': false,
                        'isSpoiler': false,
                        'content': {
                            'richText': '{"document":[{"e":"par","c":[{"e":"text","t":"' + body + '","f":[[0,0,7]]}]}]}'
                        },
                        'title': title,
                        'isCommercialCommunication': false,
                        'targetLanguage': ''
                    }
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            return data;
        })
    return index
}

function infoAccount(cookie, proxyMu) {
    const index = fetch('https://www.reddit.com/?rdt=43467', {
            agent: new HttpsProxyAgent(proxyMu),
            headers: {
                'Host': 'www.reddit.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding': 'gzip, deflate, br',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Priority': 'u=1',
                'Te': 'trailers',
                'Cookie': cookie
            }
        })

        .then(async res => {
            const data = await res.text()
            return data;
        })
    return index
}

function createAccountEth() {
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const publicKey = wallet.publicKey;
    return {
        privateKey,
        publicKey,
        address: wallet.address
    };
};



const functionGetTokenAction = (sitekey, linkAccess, version) =>
    new Promise((resolve, reject) => {
        fetch(
                `http://2captcha.com/in.php?key=${keyCaptcha}&method=userrecaptcha&googlekey=${sitekey}&pageurl=${linkAccess}`, {
                    method: "get",
                }
            )
            .then((res) => res.text())
            .then((text) => {
                resolve(text);
            })
            .catch((err) => reject(err));
    });

const functionGetRealTokenAction = (id) =>
    new Promise((resolve, reject) => {
        fetch(
                `http://2captcha.com/res.php?key=${keyCaptcha}&action=get&json=1&id=${id}`, {
                    method: "get",
                }
            )
            .then((res) => res.json())
            .then((text) => {
                resolve(text);
            })
            .catch((err) => reject(err));
    });
const cookieHelpers = (arrayCookie) => {
    let newCookie = '';
    for (let index = 0; index < arrayCookie.length; index++) {
        const element = arrayCookie[index];
        if (index < arrayCookie.length - 1) {
            newCookie += element.split(';')[0] + '; ';
        } else {
            newCookie += element.split(';')[0];
        }

    }
    return newCookie
};

const randstr = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });


const getCookie = (proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'GET'
        })
        .then(res => {
            resolve(cookieHelpers(res.headers.raw()['set-cookie']))
        })
        .catch(err => reject(err))
});


const generateUsername = (cookie, csrf, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/svc/shreddit/graphql', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'Content-Length': '107',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsettings%2Fprofile',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            },
            body: JSON.stringify({
                'operation': 'GeneratedUsernames',
                'variables': {
                    'count': 10
                },
                'csrf_token': csrf
            })
        })
        .then(async res => {
            resolve({
                cookie: res.headers.raw()['set-cookie'],
                data: await res.json()
            })
        })
        .catch(err => reject(err))
});

const checkUsername = (cookie, csrf, username, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/svc/shreddit/graphql', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'Content-Length': '107',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsettings%2Fprofile',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            },
            body: JSON.stringify({
                "operation": "IsUsernameValidForRegistration",
                "variables": {
                    "input": {
                        "username": username
                    }
                },
                "csrf_token": csrf
            })
        })
        .then(async res => {
            resolve({
                cookie: res.headers.raw()['set-cookie'],
                data: await res.json()
            })
        })
        .catch(err => reject(err))
});

const checkEmail = (cookie, csrf, email, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/svc/shreddit/graphql', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'Content-Length': '107',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsettings%2Fprofile',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            },
            body: JSON.stringify({
                "operation": "IsEmailValidForRegistration",
                "variables": {
                    "input": {
                        "email": email
                    }
                },
                "csrf_token": csrf
            })
        })
        .then(async res => {
            resolve({
                cookie: res.headers.raw()['set-cookie'],
                data: await res.json()
            })
        })
        .catch(err => reject(err))
});

const registerAccount = (cookie, csrf, captchaToken, email, username, proxyMu, password) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/svc/shreddit/account/register', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.reddit.com',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'text/vnd.reddit.partial+html, application/json',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsettings%2Fprofile',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            },
            body: new URLSearchParams({
                'gRecaptchaResponse': captchaToken,
                'email': email,
                'username': username,
                'password': password,
                'csrf_token': csrf
            })
        })
        .then(async res => {
            resolve({
                cookie: cookieHelpers(res.headers.raw()['set-cookie']),
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});

const login = (cookie, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/settings/account', {
            agent: new HttpsProxyAgent(proxyMu),
            headers: {
                'Host': 'www.reddit.com',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'text/vnd.reddit.hybrid+html, text/html;q=0.9',
                'Clienthash': 'SwUGZI6TvOvZ+yCa',
                'Nonce': 'z12965lsLfqbJC9jpHRRGw==',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/settings/account',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            }
        })
        .then(async res => {
            resolve({
                cookie: cookieHelpers(res.headers.raw()['set-cookie']),
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});

const secondLogin = (cookie, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.reddit.com/svc/shreddit/onboarding-flow', {
            agent: new HttpsProxyAgent(proxyMu),
            headers: {
                'Host': 'www.reddit.com',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Accept': 'text/vnd.reddit.partial+html, text/html;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fsettings%2Faccount',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            }
        })
        .then(async res => {
            resolve({
                cookie: cookieHelpers(res.headers.raw()['set-cookie']),
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});

const updateBio = (redditSession, loId) => new Promise((resolve, reject) => {
    fetch('https://oauth.reddit.com/api/site_admin?raw_json=1&gilding_detail=1', {
            method: 'POST',
            headers: {
                'Host': 'oauth.reddit.com',
                'Content-Length': '1107',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzEyNTYzMzIwLjIyNTk5MiwiaWF0IjoxNzEyNDc2OTIwLjIyNTk5MiwianRpIjoiTUhGeWZvbm52bjNYaVM2T09sYWRseVE1RE9obUFnIiwiY2lkIjoiMFItV0FNaHVvby1NeVEiLCJsaWQiOiJ0Ml94c3FnbjQ4cXAiLCJhaWQiOiJ0Ml94c3FnbjQ4cXAiLCJsY2EiOjE3MTI0NzY5MTgzMzksInNjcCI6ImVKeGtrZEdPdERBSWhkLWwxejdCX3lwX05odHNjWWFzTFFhb2szbjdEVm9jazcwN2NMNGlIUDhuS0lxRkxFMnVCS0drS1dFRld0T1VOaUx2NTh5OU9aRUZTeUZUUjg0M3l3b2thVXBQVW1ONXB5bFJ3V1prTGxmYXNVS0RCNllwVlM2WjIwS1BTNXZRM0kxRnowNk1xbHhXSHRUWW8zSnBiR01LMnhQanpjWnFReXF1eTZsTVlGa29uOFdMZnZ5Ry10WS1mN2JmaEhZd3JLZ0tEX1RPdUZ4d1lfSERGSGJfbnByMGJGMndxTDNYZzlRLTEtTjI3Yk5tb2RtNV9WelB2emFTY1RtRzVpZll2N3QtQ1IxNDVIbVpVUWN3WWcwX3lyQWo2X0N2T29ES0JRV01KWWhQSTVBcmwyX19KZGl1VGY4YXR5ZC0tR2JFVFdfNHJSbW81eExFb1VfajZ6Y0FBUF9fWERfZTR3IiwicmNpZCI6Ikd1d1N5VnNiWmJmZVIzbFpRTjJ2S3BIQzVjdzVxZGpNLVIwQ2UxSS0tdDQiLCJmbG8iOjJ9.klazmMKqaS4XEXQ1FunQtDwaevJyVZUwShEEpRTGQrIhUHe7JTu9HrO_exYo-3i7kg3FMjmyBuNiHrZE0ciq2bYg4vSGq5MsfazWMRPTZwSy3QZzec8Ss0mDSIzNgGoZ5YNki2cp1mAXCtLefuQo-1nOmOiWLPXclONHQnOWXSGCSF-5U3s_Uii4WgwrbGnyN0Hnwyou6-qEOimC_onhqNWqYQXAX3z1fDZwxYUGKWBW5tJ3xdy43Xqs2MMJ6oILDTufuiF6C1gSP5TOWyXufy2c8w2VvA_JHE6zviA4byoxriGpi0l_5LeJdK-kew12CyBjMzqRVxZxrJwowHV7JQ',
                'X-Reddit-Loid': '000000000xsqgn48qp.2.1712476918339.Z0FBQUFBQm1FbEw0S0NZM1Q4Nk5JYm5FenlmVTZUN0R0cTlENGVRMGRYWWhtY1RGbE1PbkdGSWRlVDRBOWhGVjBELUJBVFktY0NfQlI5R1pzQkZ4VTRNRDN1eGRwYU12N3V2SzkwNUNlbl9LUnFtbElEZElNTlVLNzF4MEdCOEtaMHFVSXV0LWR3QmE',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Reddit-Session': redditSession,
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Accept': '*/*',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.9',
                'Origin': 'https://www.reddit.com',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.reddit.com/',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            body: 'allow_polls=true&allow_galleries=true&allow_videos=true&allow_post_crossposts=true&allow_predictions=false&allow_predictions_tournament=false&allow_chat_post_creation=false&allow_images=true&allow_discovery=true&allow_top=true&api_type=json&collapse_deleted_comments=true&comment_score_hide_mins=0&crowd_control_filter=false&crowd_control_mode=false&crowd_control_level=0&crowd_control_chat_level=1&crowd_control_post_level=0&disable_contributor_requests=false&description=TEST&domain&exclude_banned_modqueue=false&header-title=&hide_ads=false&key_color=&lang=en&link_type=any&modmail_harassment_filter_enabled=false&over_18=false&public_description=ajacoba&public_traffic=false&restrict_commenting=false&restrict_posting=true&show_media=true&show_media_preview=true&should_archive_posts=false&spam_comments=low&spam_links=low&spam_selfposts=low&spoilers_enabled=true&sr=t5_b94j0v&submit_link_label=&submit_text=&submit_text_label=&suggested_comment_sort=qa&title=&toxicity_threshold_chat_level=1&type=user&welcome_message_enabled=false&welcome_message_text&wiki_edit_age=0&wiki_edit_karma=100&wikimode=disabled'
        })
        .then(async res => {
            resolve({
                cookie: cookieHelpers(res.headers.raw()['set-cookie']),
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});

// section rdat dao
const getRdatSession = () => new Promise((resolve, reject) => {
    fetch('https://www.rdatadao.org/home', {
            method: 'GET',
            agent: new HttpsProxyAgent(proxyMu),
        })
        .then(async res => {
            resolve({
                cookie: res.headers.raw()['set-cookie'],
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});
const getFormRedditSession = (username) => new Promise((resolve, reject) => {
    fetch('https://www.rdatadao.org/home?_data=routes%2Fhome', {
            method: 'POST',
            headers: {
                'Host': 'www.rdatadao.org',
                'Content-Length': '35',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': '*/*',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.8',
                'Origin': 'https://www.rdatadao.org',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.rdatadao.org/home',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': `form-reddit-user=${Buffer.from(JSON.stringify({ "redditUsername": username })).toString('base64')}; _vcrcs=1.1712481207.3600.OGEyYjQ3NWQ0ZWI0ZjE5NWFmMDAxNTJjZGIxNDlhY2I=.cf90ce65ab7f1336580b99e6bb221644; __session=eyJ1c2VySWQiOiI4YzcxNGY5Mi03Y2VhLTQ1MzktYjQ1MS0xZGNhMzVlOGVlZDUifQ%3D%3D.pQrEkW5rNqFVrVHefLecPRiJ4ox8e35pvyV0V0jt3AM; _dd_s=logs=1&id=70968237-f5a6-4106-998a-e63426f87c21&created=1712478480419&expire=1712482749087&rum=2`
            },
            body: new URLSearchParams({
                'redditUsername': username
            })
        })
        .then(async res => {
            resolve({
                cookie: res.headers.raw()['set-cookie'],
                status: res.status,
                data: await res.text()
            })
        })
        .catch(err => reject(err))
});

const loginWalletRdat = (cookie, walletAddress, proxyMu) => new Promise((resolve, reject) => {
    fetch('https://www.rdatadao.org/api/login', {
            agent: new HttpsProxyAgent(proxyMu),
            method: 'POST',
            headers: {
                'Host': 'www.rdatadao.org',
                'Sec-Ch-Ua': '"Brave";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'Sec-Ch-Ua-Platform': '"macOS"',
                'Sec-Ch-Ua-Mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Sec-Gpc': '1',
                'Accept-Language': 'en-US,en;q=0.8',
                'Origin': 'https://www.rdatadao.org',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.rdatadao.org/home/login',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cookie': cookie
            },
            agent: new HttpsProxyAgent(proxyMu),
            body: JSON.stringify({
                'address': walletAddress
            })
        })
        .then(async res => {
            resolve({
                // cookie: cookieHelpers(res.headers.raw()['set-cookie']),
                status: res.status,
                data: await res.json()
            })
        })
        .catch(err => reject(err))
});

const getEmailRandom = (email, domain) => new Promise((resolve, reject) => {
    fetch(`https://generator.email/`, {
            method: "get",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br"
            }
        })
        .then(res => res.text())
        .then(text => {
            const $ = cheerio.load(text);
            const result = [];
            $('.e7m.tt-suggestions').find('div > p').each(function (index, element) {
                result.push($(element).text());
            });
            resolve(result);
        })
        .catch(err => reject(err));
});

(async () => {
    while (true) {
        const filePath = path.join(__dirname, 'license.txt');
        if (fs.existsSync(filePath)) {} else {
            var apiKey = readlineSync.question("[+] Input License : ")
            fs.appendFileSync(filePath, apiKey);
        }

        var license = fs.readFileSync(`license.txt`, 'UTF-8');
        const licenseCheckResult = await licenseCheck(license);
        const namaBuyer = licenseCheckResult.FullName;
        const duration = licenseCheckResult.Duration;
        const MachineId1 = licenseCheckResult.MachineId1;
        const MachineId2 = licenseCheckResult.MachineId2;
        const MachineId3 = licenseCheckResult.MachineId3;
        const MachineId4 = licenseCheckResult.MachineId4;
        const MachineId5 = licenseCheckResult.MachineId5;
        const MachineId6 = licenseCheckResult.MachineId6;
        const MachineId7 = licenseCheckResult.MachineId7;
        const MachineId8 = licenseCheckResult.MachineId8;
        const MachineId9 = licenseCheckResult.MachineId9;
        const MachineId10 = licenseCheckResult.MachineId10;

        // if (namaBuyer) {
        //     console.log(chalk.white(`\n    Successfully running`))
        //     break;
        // } else {
        //     console.log(chalk.white(`\n    Failure running`))
        //     console.log(chalk.red(`    Contact Admin`))
        //     process.exit(0)
        // }
        let id = machineIdSync;
        let myId = await id.machineSync({
            original: true
        });
        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Machine Id :`, chalk.yellow(`${myId}`))
        if (namaBuyer) {
            console.log(chalk.white(`\nHas Found License`), chalk.green(`${namaBuyer}`), chalk.white(`Duration : `) + chalk.yellow(`${duration} Days\n`));
        } else {
            console.log(chalk.white(`\nNot Found License\n`));
            console.log(err)
            process.exit(0)
        }
        var data = `${MachineId1},${MachineId2}`;

        if (data.match(myId)) {} else {
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Not Found Machine ID On License :`, chalk.yellow(`${myId}`))
        }

        if (MachineId1 == '') {
            const addMachinez = await addMachine1(license, myId);
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Added Machine ID 1 :`, chalk.yellow(`${myId}`))
            continue;
        } else if (MachineId1 == myId) {
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Found Machine ID 1 :`, chalk.yellow(`${MachineId1}`))
            break;
        }

        if (MachineId2 == '') {
            const addMachinez = await addMachine2(license, myId);
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Added Machine ID 2 :`, chalk.yellow(`${myId}`))
            continue;
        } else if (MachineId2 == myId) {
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Found Machine ID 2 :`, chalk.yellow(`${MachineId2}`))
            break;
        }
    }

    if (fs.existsSync('loginReddit.json')) {} else {
        fs.appendFileSync("loginReddit.json", '[]');
    }
    console.log()
    console.log(chalk.yellow(`    Membership x ETL Discussion\n`))

    console.log(`    List Account Login`)
    console.log()
    var configData = fs.readFileSync(`loginReddit.json`);
    var config = JSON.parse(configData)
    const detect = config;
    var totalAccount = config.length;

    let tableData = [
        ['id', 'Username Reddit', ]
    ];
    const configTable = {
        columns: [{
            alignment: 'center'
        }]
    };

    awal: for (let index = 0; index < totalAccount; index++) {
        const cookie = detect[index].cookie;
        try {
            var checkProfiledata = await infoAccount(cookie, proxyMu);
        } catch (err) {
            continue awal;
        }
        try {
            var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*)</span>')[1]
        } catch (err) {
            var username = "Account Not Login";
        }

        tableData.push([index, chalk.green(username)])
    }
    console.log(table(tableData, configTable))


    console.log('[1] ' + chalk.green('Reddit Account Creator [ Saved to accountReddit.txt ]'))
    console.log('[2] ' + chalk.green('Reddit Auto Post '))
    console.log('[3] ' + chalk.red('Reddit Auto UpVote '))
    console.log('[4] ' + chalk.green('Reddit Auto Comment '))

    console.log()
    var pilihan = readlineSync.question('[!] Vote Tools? : ')
    console.log()
    if (pilihan == 1) {
        var total = readlineSync.question('[!] Total Account : ')
        console.log()

        for (let indexc = 0; indexc < total; indexc++) {
            const firstName = faker.person.firstName().replace(/["']/g, "");
            const lastName = faker.person.lastName().replace(/["']/g, "");
            const email = `${firstName}${lastName}${await randstr(5)}@${domain}`.toLowerCase();

            const checkingIP = await checkIP();
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `IP       : ${checkingIP}`)
            awal: while (true) {
                try {
                    var resultCookie = await getCookie(proxyMu);
                    var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                    break;
                } catch (err) {
                    console.log(err)
                    continue awal;
                }
            }

            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

            const generateUsernameResult = await generateUsername(resultCookie, csrfToken, proxyMu);
            const generatedUsername = generateUsernameResult.data.data.generatedUsernames;
            const usernameRandom = generatedUsername[Math.floor(Math.random() * generatedUsername.length)];
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Username : ${usernameRandom}`)

            let newSessionTracker = generateUsernameResult.cookie[0].split('=')[1].split(';')[0];
            let newcsrfToken = generateUsernameResult.cookie[1].split('=')[1].split(';')[0];
            resultCookie.replace(/session_tracker=.*?(?=;)/, 'session_tracker=' + newSessionTracker);
            resultCookie.replace(/csrf_token=.*?(?=;)/, 'csrf_token=' + newcsrfToken);

            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), 'Checking username....')
            const checkUsernameResult = await checkUsername(resultCookie, csrfToken, usernameRandom, proxyMu);
            newSessionTracker = checkUsernameResult.cookie[0].split('=')[1].split(';')[0];
            newcsrfToken = checkUsernameResult.cookie[1].split('=')[1].split(';')[0];
            resultCookie.replace(/session_tracker=.*?(?=;)/, 'session_tracker=' + newSessionTracker);
            resultCookie.replace(/csrf_token=.*?(?=;)/, 'csrf_token=' + newcsrfToken);

            if (checkUsernameResult.data.errors.length < 1) {
                const checkEmailForRegis = await checkEmail(resultCookie, csrfToken, email, proxyMu);
                newSessionTracker = checkEmailForRegis.cookie[0].split('=')[1].split(';')[0];
                newcsrfToken = checkEmailForRegis.cookie[1].split('=')[1].split(';')[0];
                resultCookie.replace(/session_tracker=.*?(?=;)/, 'session_tracker=' + newSessionTracker);
                resultCookie.replace(/csrf_token=.*?(?=;)/, 'csrf_token=' + newcsrfToken);
                if (checkEmailForRegis.data.errors.length < 1) {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), 'Email ' + email + '')
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), 'Waiting For Bypass Captcha')
                    const actionToken = await functionGetTokenAction(
                        "6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC", "https://www.reddit.com/", "v2"
                    );
                    const requestId = actionToken.split("|")[1];
                    let resultActionToken = {
                        request: "",
                    };

                    do {
                        resultActionToken = await functionGetRealTokenAction(requestId);
                    } while (resultActionToken.request === "CAPCHA_NOT_READY");
                    const captchaREsponse = resultActionToken.request;

                    const registerResult = await registerAccount(resultCookie, csrfToken, captchaREsponse, email, usernameRandom, proxyMu, password);
                    if (registerResult.status === 200) {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Account successfully created! ${email}|${password}`);
                        fs.appendFileSync('./accountReddit.txt', `${email}|${usernameRandom}|${password}\n`)

                        const arrayPush = detect.push({
                            cookie: registerResult.cookie
                        });

                        var cookie = registerResult.cookie;
                        const checkProfiledata = await infoAccount(cookie, proxyMu);
                        try {
                            var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]

                            const testlistJson = JSON.stringify(detect);
                            fs.unlinkSync(`loginReddit.json`)

                            fs.appendFileSync(`loginReddit.json`, testlistJson);
                            console.log(chalk.green('    Successfully input cookie'))
                        } catch (err) {
                            console.log(chalk.green('    Failure input cookie [ Cookie Not Valid ] '))
                        }

                    } else {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), 'Failed to create account!')
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Error : ${registerResult.data}`)
                    }
                } else {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), 'Email unavailable!')
                }

            } else {
                console.log('Username has been taken!')
            }
        }
    } else if (pilihan == 2) {
        var option = readlineSync.question(`[!] Mass Account [ ` + chalk.green(`y`) + ` ] Select account [ ` + chalk.green(`n`) + ` ] ?? : `)
        var totalPost = readlineSync.question(`[!] Total Post / Account : `)

        console.log()

        if (option.toLowerCase() == "n") {
            var select = readlineSync.question('[!] Account Number : ')
            console.log()

            const cookie = detect[select].cookie;

            for (let index = 0; index < totalPost; index++) {
                var titleFile = fs.readFileSync('title.txt').toString();

                const readMe = titleFile.split(/\r?\n/)
                const lineCount = readMe.length
                const randomLineNumber = Math.floor(Math.random() * lineCount)
                var title = readMe[randomLineNumber]

                var bodyFile = fs.readFileSync('body.txt').toString();

                const readMe2 = bodyFile.split(/\r?\n/)
                const lineCount2 = readMe2.length
                const randomLineNumber2 = Math.floor(Math.random() * lineCount2)
                var body = readMe2[randomLineNumber2]

                awal: while (true) {
                    try {
                        var resultCookie = await getCookie(proxyMu);
                        var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                        break;
                    } catch (err) {
                        continue awal;
                    }
                }

                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

                const checkProfiledata = await infoAccount(cookie, proxyMu);
                try {
                    var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                    console.log()
                } catch (err) {

                }

                const autoPostReddit = await autoPost(csrfToken, cookie, proxyMu, title, body)

                try {
                    var permalink = autoPostReddit.data.createProfilePost.post.permalink
                    var id = autoPostReddit.data.createProfilePost.post.id
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Title Post : ${title}`)
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Body Post  : ${body}`)
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Post ID : ${id}`)
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Post Successfully https://www.reddit.com${permalink}`)
                } catch (err) {

                }
                console.log()
            }
        } else if (option.toLowerCase() == "y") {
            for (let indexku = 0; indexku < totalAccount; indexku++) {
                for (let index = 0; index < totalPost; index++) {

                    var titleFile = fs.readFileSync('title.txt').toString();

                    const readMe = titleFile.split(/\r?\n/)
                    const lineCount = readMe.length
                    const randomLineNumber = Math.floor(Math.random() * lineCount)
                    var title = readMe[randomLineNumber]

                    var bodyFile = fs.readFileSync('body.txt').toString();

                    const readMe2 = bodyFile.split(/\r?\n/)
                    const lineCount2 = readMe2.length
                    const randomLineNumber2 = Math.floor(Math.random() * lineCount2)
                    var body = readMe2[randomLineNumber2]

                    const cookie = detect[indexku].cookie;
                    awal: while (true) {
                        try {
                            var resultCookie = await getCookie(proxyMu);
                            var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                            break;
                        } catch (err) {
                            continue awal;
                        }
                    }

                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

                    const checkProfiledata = await infoAccount(cookie, proxyMu);
                    try {
                        var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                        console.log()
                    } catch (err) {

                    }
                    const autoPostReddit = await autoPost(csrfToken, cookie, proxyMu, title, body)

                    try {
                        var permalink = autoPostReddit.data.createProfilePost.post.permalink
                        var id = autoPostReddit.data.createProfilePost.post.id
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Title Post : ${title}`)
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Body Post  : ${body}`)
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Post ID : ${id}`)
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Post Successfully https://www.reddit.com${permalink}`)

                    } catch (err) {

                    }

                    console.log()
                }
            }
        }
    } else if (pilihan == 3) {
        var option = readlineSync.question(`[!] Mass Account [ ` + chalk.green(`y`) + ` ] Select account [ ` + chalk.green(`n`) + ` ] ?? : `)

        console.log()

        if (option.toLowerCase() == "n") {
            var select = readlineSync.question('[!] Account Number : ')
            var postId = readlineSync.question('[!] Post ID        : ')

            console.log()

            const cookie = detect[select].cookie;

            awal: while (true) {
                try {
                    var resultCookie = await getCookie(proxyMu);
                    var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                    break;
                } catch (err) {
                    continue awal;
                }
            }

            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

            const checkProfiledata = await infoAccount(cookie, proxyMu);
            try {
                var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                console.log()
            } catch (err) {

            }


            console.log(postId)

            const autoupVoteNotif = await autoUpVote(csrfToken, cookie, proxyMu, postId)

            try {
                var status = autoupVoteNotif.data.updatePostVoteState.ok
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Upvote : ${status}`)
            } catch (err) {

            }

            console.log()

        } else if (option.toLowerCase() == "y") {
            var postId = readlineSync.question('[!] Post ID        : ')
            console.log()
            for (let indexku = 0; indexku < totalAccount; indexku++) {
                const cookie = detect[indexku].cookie;
                awal: while (true) {
                    try {
                        var resultCookie = await getCookie(proxyMu);
                        var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                        break;
                    } catch (err) {
                        continue awal;
                    }
                }

                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

                const checkProfiledata = await infoAccount(cookie, proxyMu);
                try {
                    var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                    console.log()
                } catch (err) {

                }
                const autoupVoteNotif = await autoUpVote(csrfToken, cookie, proxyMu, postId)

                try {
                    var status = autoupVoteNotif.data.updatePostVoteState.ok
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Upvote : ${status}`)
                } catch (err) {

                }

                console.log()
            }
        }
    } else if (pilihan == 4) {
        var option = readlineSync.question(`[!] Mass Account [ ` + chalk.green(`y`) + ` ] Select account [ ` + chalk.green(`n`) + ` ] ?? : `)

        console.log()

        if (option.toLowerCase() == "n") {
            var select = readlineSync.question('[!] Account Number : ')
            var postId = readlineSync.question('[!] Post ID        : ')

            var titleFile = fs.readFileSync('comment.txt').toString();

            const readMe = titleFile.split(/\r?\n/)
            const lineCount = readMe.length
            const randomLineNumber = Math.floor(Math.random() * lineCount)
            var commentku = readMe[randomLineNumber]

            console.log()

            const cookie = detect[select].cookie;

            awal: while (true) {
                try {
                    var resultCookie = await getCookie(proxyMu);
                    var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                    break;
                } catch (err) {
                    continue awal;
                }
            }

            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

            const checkProfiledata = await infoAccount(cookie, proxyMu);
            try {
                var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                console.log()
            } catch (err) {

            }

            const commentProgress = await comment(csrfToken, cookie, proxyMu, postId, commentku)
            if (commentProgress.match(commentku)) {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Comment : Success`)
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Info Comment   : ${commentku}`)
            } else {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Comment : Failure`)
            }

            console.log()

        } else if (option.toLowerCase() == "y") {
            var postId = readlineSync.question('[!] Post ID        : ')
            console.log()
            for (let indexku = 0; indexku < totalAccount; indexku++) {
                const cookie = detect[indexku].cookie;


                var titleFile = fs.readFileSync('comment.txt').toString();

                const readMe = titleFile.split(/\r?\n/)
                const lineCount = readMe.length
                const randomLineNumber = Math.floor(Math.random() * lineCount)
                var commentku = readMe[randomLineNumber]

                awal: while (true) {
                    try {
                        var resultCookie = await getCookie(proxyMu);
                        var csrfToken = resultCookie.split('csrf_token=')[1].split(';')[0];
                        break;
                    } catch (err) {
                        continue awal;
                    }
                }

                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `CSRF     : ${csrfToken}`)

                const checkProfiledata = await infoAccount(cookie, proxyMu);
                try {
                    var username = checkProfiledata.match('<span class="text-12 text-secondary-weak">u/(.*?)</span>')[1]
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting For Login Account ${username}`)
                    console.log()
                } catch (err) {

                }
                const commentProgress = await comment(csrfToken, cookie, proxyMu, postId, commentku)
                if (commentProgress.match(commentku)) {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Comment : Success`)
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Info Comment   : ${commentku}`)
                } else {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Status Comment : Failure`)
                }
                console.log()
            }
        }
    }
})();


function licenseCheck(license) {
    var license = fetch(`https://whitelist-bot.com/api.php?license=${license}`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "_ga=GA1.2.1441011143.1656930356"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return license
}

function addMachine1(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId1': machine
        })
    })
}

function addMachine2(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId2': machine
        })
    })
}