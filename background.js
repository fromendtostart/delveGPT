chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(['words'], function(result) {
        if (!result.words) chrome.storage.sync.set({ words: ['delve'] });
    });
});
	