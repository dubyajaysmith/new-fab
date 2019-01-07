// jshint asi: true, esversion: 6, laxcomma: true

console.log('background.js --> New Fab background does nothing right now')
chrome.extension.connectNative('newfab')
const breaker = { breaker: "just a break, howdy" }

chrome.runtime.onMessage.addListener((request, sender) => {
	console.dir('hello from background, haz message')
	console.dir(sender)
	console.dir(request)

	if(request.type == 'info'){
		const port = chrome.runtime.connectNative('jamiesmith.app.newfab')

		port.postMessage(request.value)

		port.onMessage.addListener(message => {
			console.log(message)
		})

		port.onDisconnect.addListener(error => {
			console.dir(error)
			console.dir(chrome.runtime.lastError.message)
		})


	}

})



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
/*
let URLs = [] // TODO I don't like this global...
chrome.storage.sync.get(['ww_store'], (result) => {

	const ww_store = result.ww_store

	if(typeof ww_store !== 'object'){
		const ww_store = {
			urls: []
		}
		chrome.storage.sync.set({ww_store})
	}
	else {
		URLs = ww_store.urls
	}
})

const saveUri = (url) => {
	if(url){
		chrome.storage.sync.get(['ww_store'], (result) => {
			
			const ww_store = result.ww_store
			const o = {
				url,
				time: 0
				, added: new Date().getTime()
				, updated: new Date().getTime()
			}
			const filter = ww_store.urls.filter(x => x.url === url)
			if(filter.length === 0){
				ww_store.urls.push(o)
				URLs.push(o) // todo prolly del this
				chrome.storage.sync.set({ww_store})
			}
		})
	}
}

const getUri = () => new Promise(res => 
		chrome.storage.sync.get(['ww_store'], x => res(x)))

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

getUri().then(x => console.dir(x))


*/