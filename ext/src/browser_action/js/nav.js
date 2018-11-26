// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const dom = {
    side: document.querySelector('.side'),
    main: document.querySelector('.main')
}

dom.navs = Array.from(dom.side.querySelectorAll('svg'))
dom.cmps = Array.from(dom.main.children)

dom.cmps.map(x => x !== dom.cmps[0] ? x.style.display = 'none': null)

dom.navs.map(n => n.onclick = () => {
    //console.log(`${n.id} clicked`)
    dom.cmps.map(x => {
        console.log(n.id, x.localName)
        if(n.id == x.localName){
            x.style.display = 'block'
        }
        else {
            x.style.display = 'none'
        }
    })
})


//console.dir(dom.navs)
//console.dir(dom.cmps)