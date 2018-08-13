const dom = {
    ul: document.querySelector('ul')
}

const port = chrome.extension.connect({
    name: 'Sample Communication'
})

port.postMessage("sending to background")
port.onMessage.addListener(msg => {
    msg.map(x => {

        const l = document.createElement('a')
        l.textContent = x
        dom.ul.appendChild(l).appendChild(document.createElement('br'))
    })
});