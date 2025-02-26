const ITEMS_ID = [
    'pagespeed',
    'validHTML',
    'validCSS',
    'structuredData',
    'icons',
    'yandexIKS',
    'alexaRanks',
    'searchGoogle',
    'searchYandex',
    'robotsTxt'
];

function openPageAnalysis(info, tab) {
    let url,
        paramsUrl = tab.url.match(/(^https?):\/\/(([^/]+).*)/); // [url, protocol, patch, domen]

    switch (info.menuItemId) {
        case 'pagespeed':      url = `https://developers.google.com/speed/pagespeed/insights/?url=${tab.url}`; break;
        case 'validHTML':      url = `https://validator.w3.org/nu/?doc=${tab.url}`; break;
        case 'validCSS':       url = `https://jigsaw.w3.org/css-validator/validator?uri=${tab.url}&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=ru`; break;
        case 'structuredData': url = `https://search.google.com/structured-data/testing-tool/u/0/?hl=ru#url=${tab.url}`; break;
        case 'icons':          url = `https://realfavicongenerator.net/favicon_checker?protocol=${paramsUrl[1]}&site=${paramsUrl[2]}`; break;
        case 'yandexIKS':      url = `https://webmaster.yandex.ru/sqi/?host=${paramsUrl[3]}`; break;
        case 'alexaRanks':     url = `https://www.alexa.com/siteinfo/${paramsUrl[3]}`; break;
        case 'searchGoogle':   url = `https://www.google.com/search?q=site:${paramsUrl[3]}`; break;
        case 'searchYandex':   url = `https://yandex.ru/search/?text=site:${paramsUrl[3]}`; break;
        case 'robotsTxt':      url = `${paramsUrl[1]}://${paramsUrl[3]}/robots.txt`; break;
    }

    if (url) chrome.tabs.create({ url });
}

function createItemsMenu() {
    const keyStorage = ITEMS_ID.map(el => `settings_${ el }`);

    chrome.storage.sync.get(keyStorage, result => {
        ITEMS_ID.forEach(el => {
            if (result[`settings_${ el }`]) {
                chrome.contextMenus.create({
                    id: el,
                    title: chrome.i18n.getMessage(`itemMenu_${ el }`),
                    contexts: ['all'],
                    documentUrlPatterns: ['http://*/*', 'https://*/*']
                })
            }
        })
    })
}

createItemsMenu();

chrome.contextMenus.onClicked.addListener(openPageAnalysis);

/**
 * Слушатель изменения настроек
 */
chrome.storage.onChanged.addListener(() => chrome.contextMenus.removeAll(createItemsMenu));

/**
 * Слушатель событий действий расширения
 */
chrome.runtime.onInstalled.addListener(details => {
    /**
     * Событие установки расширения
     */
    if (details.OnInstalledReason === 'install') {
        /**
         * Задать настройки по умолчанию после установки расширения
         */
        let params = {};

        ITEMS_ID.forEach(el => params[`settings_${ el }`] = true);

        chrome.storage.sync.set(params);


        /**
         * Открыть страницу настроек расширения
         */
        chrome.runtime.openOptionsPage();
    }
});
