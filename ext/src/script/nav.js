// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const dom = {
    side: document.querySelector('.side'),
    main: document.querySelector('.main')
}

dom.navs = Array.from(dom.side.querySelectorAll('svg'))
dom.cmps = Array.from(dom.main.children)

dom.navs.map(n => n.onclick = () => {
    
    dom.cmps.map(x => n.id == x.localName ? x.classList.add('active') : x.classList.remove('active'))

    dom.navs.map(el => el.id !== n.id ? el.classList.remove('active') : el.classList.add('active'))
})

dom.navs[0].onclick()