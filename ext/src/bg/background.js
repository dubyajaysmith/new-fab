// jshint asi: true, esversion: 6, laxcomma: true

console.log('background.js --> work-watch')

/* TODOs

Store all SF urls hit to start
	L set store 

UI get stored SF urls
	L UI to set storage for job organizing	

Potential blacklist ?
	L "https://login.salesforce.com"
	L "https://success.salesforce.com"
	L "https://appexchange.salesforce.com"



*/
// DEV - Reset data
//chrome.storage.sync.set({ww_store: ''})

// Setup store & list of urls
let URLs = [] // TODO I don't like this global...
chrome.storage.sync.get(['ww_store'], (result) => {

	const ww_store = result.ww_store

	if(typeof ww_store !== 'object'){
		const ww_store = {
			urls: []
			, time: 0
			, added: new Date().getTime()
			, updated: new Date().getTime()
		}
		chrome.storage.sync.set({ww_store})
	}
	else {
		URLs = ww_store.urls
	}
})

		
const saveUri = (uri) => {
	chrome.storage.sync.get(['ww_store'], (result) => {
		
		const ww_store = result.ww_store

		ww_store.urls.push(uri)
		URLs.push(uri)
		chrome.storage.sync.set({ww_store})
	})
}

chrome.webRequest.onCompleted.addListener(
	
	(details) => {
		if(details.url.includes('salesforce.com')){
			
			// Is it already in store?
			if(details.initiator && URLs.includes(details.initiator)){
				// could keep tally of hits or something... unsure if useful yet
			}
			else {
				saveUri(details.initiator)
			}
		}
	},
	{urls: ["<all_urls>"]},
	[]
)

chrome.extension.onConnect.addListener(port => {
	console.log("Refresh UI")
	port.onMessage.addListener(msg => {
		console.log('background recieved: ', msg)
		port.postMessage(URLs)
	});
})