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

        const url = x.replace('https://', '').replace('http://', '')

        const a = document.createElement('a')
        const l = document.createElement('li')
        l.title = url
        a.textContent = url
        dom.ul.appendChild(l).appendChild(a).appendChild(document.createElement('br'))
    })
});