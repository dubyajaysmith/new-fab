// jshint asi: true, esversion: 6, laxcomma: true
const dom = {
    ul: document.querySelector('ul')
}

const port = chrome.extension.connect({
    name: 'Sample Communication'
})

port.postMessage("sending to background")
port.onMessage.addListener(urls => {
    urls.filter(x => x).map(x => {

        const url = x.url.replace('https://', '').replace('http://', '')

        const a = document.createElement('a')
        const l = document.createElement('li')
        l.title = `${x.time} on ${url} updated ${new Date(x.updated).toUTCString()}`
        a.textContent = url
        dom.ul.appendChild(l).appendChild(a).appendChild(document.createElement('br'))
    })
});