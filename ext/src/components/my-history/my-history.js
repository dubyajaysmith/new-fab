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
.preview {
    left: -400px;
    top: -300;
    width: 2500px;
    height: 1260;
    transform: scale(.25);
    z-index: 999;
    position: absolute;
    border-radius: 5px;
    background: var(--grey-dark);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
.frame {
    width: 100%;
    height: 100%;
}
.hide {
    display: none;
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

    <br/>
    
    <h2>Recent</h2>
    <section class="recent">
    </section>
    
    <br/>

    <div class="preview hide">
        <iframe class="frame hide" src="https://www.example.com" />
    </div>
</div>
`

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
        console.log('initElements')
        console.dir(doc)
        this.dom = {
            card: doc.querySelector('.card'),
            books: doc.querySelector('.books'),
            recent: doc.querySelector('.recent'),
            preview: doc.querySelector('.preview'),
            frame: doc.querySelector('.frame')
        }

        //dom.save.onclick = () => {
        //    console.log('SAVE ', dom.note.value)
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

                    const a = document.createElement('a')
                    a.href = `${x.url}`
                    a.target = `_self`

                    //preview on hover :)
                    a.onmouseover = e => {
                    
                        if (this.dom.frame.src != a.href) {
                        
                            this.dom.frame.classList.remove('hide')
                            this.dom.frame.src = a.href 
                            this.dom.frame.onload = () => {
                                console.log('loaded')              
                                this.dom.frame.width    = this.dom.frame.contentWindow.document.body.scrollWidth
                                this.dom.frame.height   = this.dom.frame.contentWindow.document.body.scrollHeight
                                this.dom.preview.width  = this.dom.frame.contentWindow.document.body.scrollWidth
                                this.dom.preview.height = this.dom.frame.contentWindow.document.body.scrollHeight      
                            
                            }

                            this.dom.frame.contentWindow.location.reload(true)
                        }

                        this.dom.preview.classList.remove('hide')
                    }

                    const img = document.createElement('img')
                    img.title = `${x.url}`
                    img.src = `http://www.google.com/s2/favicons?domain=${url.hostname}`

                    a.appendChild(img)
                    
                    this.dom.books.appendChild(a)
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
                

                const img = document.createElement('img')
                img.title = x.url
                img.src = `http://www.google.com/s2/favicons?domain=${url.hostname}`

                const a = document.createElement('a')
                a.href = `${x.url}`
                a.target = "_self"
                
                //a.textContent = url.length > 50 ? `${url.substring(0, 50)}...` : url
                    
                    
                //preview on hover :)
                a.onmouseover = e => {
                
                    if (this.dom.frame.src != a.href) {
                    
                        this.dom.frame.classList.remove('hide')
                        this.dom.frame.src = a.href 
                        this.dom.frame.onload = () => {
                            console.log('loaded')              
                            this.dom.frame.width    = this.dom.frame.contentWindow.document.body.scrollWidth
                            this.dom.frame.height   = this.dom.frame.contentWindow.document.body.scrollHeight
                            this.dom.preview.width  = this.dom.frame.contentWindow.document.body.scrollWidth
                            this.dom.preview.height = this.dom.frame.contentWindow.document.body.scrollHeight      
                        
                        }

                        this.dom.frame.contentWindow.location.reload(true)
                    }

                    this.dom.preview.classList.remove('hide')
                }
            
                //o.onmouseout = () => dom.preview.classList.toggle('hide')
                
                a.appendChild(img)
                
                return a
            }
        }

        chrome.history.search({text:'', maxResults: 35}, (res) => {

            const recent = this.dom.recent

            const data = []
            res.map(x => {
                if(x.url || !data.contains(x.title)){
                    data.push(x.title)
                    recent.appendChild(link(x))
                }
            })
        })

        this.registerListeners()
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
    registerListeners(){

        /* preview */
        this.dom.preview.onclick = e => {
            e.preventDefault()
            console.log('zoomzoom')
        }
        this.dom.preview.ondblclick = e => {
            e.preventDefault()
            
            console.log('ondblclick ')
            window.open(this.dom.frame.src, '_self')
        }

        /* card / clear higher things */
        this.dom.card.onclick = () => {
            console.log('card click')
            this.dom.preview.classList.add('hide')
        }
    }
}



customElements.define(MyHistory.is, MyHistory)