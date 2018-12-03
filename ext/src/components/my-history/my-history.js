// jshint asi: true, esversion: 6, laxcomma: true 

/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/my-projects/my-projects.js"></script>
*/
'use strict()'

const icons = {
    addLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M7,7H11V9H7A3,3 0 0,0 4,12A3,3 0 0,0 7,15H11V17H7A5,5 0 0,1 2,12A5,5 0 0,1 7,7M17,7A5,5 0 0,1 22,12H20A3,3 0 0,0 17,9H13V7H17M8,11H16V13H8V11M17,12H19V15H22V17H19V20H17V17H14V15H17V12Z" />
    </svg>`,
    iconLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
    </svg>`
}


const style = `
<link rel="stylesheet" href="../shared/shared.css"/>
<style>
img, a {
    width: 1.75rem;
    height: 1.75rem;
    padding-right: .25rem;
}
</style>
`

const template = document.createElement('template')
template.innerHTML = `
${style}

<div class="card">
    <h2>Bookmarks</h2>
    <div class="books">
    </div>
</div>
<div class="card">
    <h2>Recent</h2>
    <section class="recent">
    </section>
</div>`

export class MyHistory extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'my-history'
    }

    static get observedAttributes() {
        
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.initElements(this.shadowRoot)
    }
    initElements(doc){
        //console.log('initElements')
        
        this.dom = {
            books: doc.querySelector('.books'),
            recent: doc.querySelector('.recent'),
        }

        //this.dom.save.onclick = () => {
        //    console.log('SAVE ', this.dom.note.value)
        //}
        console.log(this.is)
        this.buildBookmarks()
        this.buildRecent()

        
    }
    buildBookmarks(){
        let test = 0
        chrome.bookmarks.getTree(x => x.map(x => x.children.map(x => x.children.map(x => {
            if(x.url){
                if(x.url.substring(0, 7) !== 'chrome:'){

                    const url = new URL(x.url)
                    
                    this.dom.books.innerHTML += `
                        <a href="${x.url}" target="_self"><img title="${x.url}" src="http://www.google.com/s2/favicons?domain=${url.hostname}" /></a>
                    `//<img title="${x.url}" src="${uri}"/>
                }
                else {
                    return false
                }
            }
        }))))
    }
    buildRecent(){
        
        const link = x => {

            if(x.url){
                const url = new URL(x.url)
                return `<a href="${x.url}" target="_self"><img title="${x.url}" src="http://www.google.com/s2/favicons?domain=${url.hostname}" /></a>`
            }
        }

        chrome.history.search({text:'', maxResults: 35}, (res) => {
            const data = []
            res.map(x => {
                if(x.url || !data.contains(x.title)){
                    data.push(x.title)
                    this.dom.recent.innerHTML += link(x)
                }
            })
        })
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv)
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'attr name that changed!':
        //        ov !== nv // old val not equal new val
        //        break;
        //}
    }
}



customElements.define(MyHistory.is, MyHistory)