// jshint asi: true, esversion: 6, laxcomma: true 

/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/my-projects/my-projects.js"></script>
*/
'use strict()'

const icons = {
    chev: `<svg viewBox="0 0 20 20" width="30" height="30">
        <title>cheveron down</title>
        <path fill="var(--grey-dark)" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
    </svg>`,
    addLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M7,7H11V9H7A3,3 0 0,0 4,12A3,3 0 0,0 7,15H11V17H7A5,5 0 0,1 2,12A5,5 0 0,1 7,7M17,7A5,5 0 0,1 22,12H20A3,3 0 0,0 17,9H13V7H17M8,11H16V13H8V11M17,12H19V15H22V17H19V20H17V17H14V15H17V12Z" />
    </svg>`,
    iconLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
    </svg>`
}


const style = /* html */`

<style>
    
.card {
	border-radius: 5px;
	max-width: 100%;
	background: #fff;
	margin: 1rem;
	padding: 1rem;
	box-shadow: var(--shadow-low);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}

.card:hover {
	box-shadow: var(--shadow-high);
	/*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}
.cmp-container {
    border-radius: 5px;
    box-shadow: var(--shadow-low);
    padding: 0.2rem;
    border: var(--yellow);
    background: var(--yellow);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
.cmp-container:hover {
    -webkit-filter: var(--shadow-drop);
    filter: var(--shadow-drop);
}
.cmp-header {
    width: -webkit-fill-available;
    vertical-align: middle;
    display: -webkit-inline-box;
}
.cmp-header > .name {
    color: var(--grey-dark);
    line-height: 2;
    font-weight: 600;
    font-size: 1.5rem;
    padding-right: 1.2rem;
    vertical-align: bottom;
}

img, a {
    width: 1.75rem;
    height: 1.75rem;
    padding-right: .25rem;
}

.hide {
    display: none;
}


/* accordion */
.accordion .heading {
    color: var(--grey-dark);
    cursor: pointer;
    padding-top: 1rem;
    border-radius: 5px;
    padding-bottom: 1rem;
    margin-bottom: .2rem;
    background: var(--green);
}
.accordion .heading-text {
    font-size: 1.35rem;
    padding-left: .5rem;
    text-transform:capitalize;
}
.accordion .chev {
    float: right;
}

.accordion .group {
    border-radius: 5px;
    background: var(--grey-light);
}

.accordion .sub {
    padding: 0.1rem 0.5rem 1.5rem 0.5rem;
}
.accordion .sub > div {
    width: 50%;
    display: -webkit-inline-box;
}
.accordion .sub span {
    vertical-align: top;
    line-height: 2;
}
.accordion .sub a {
    text-decoration: none;
}


</style>
`

const template = document.createElement('template')
template.innerHTML = /* html */`

    ${style}

    <div class="card">
        <div class="container">

            <div class="cmp-header">
                <span class="name">Favored Sites</span>
            </div>
            <div class="books"></div>
            <br/>
            
            <div class="cmp-header">
                <span class="name">Recent</span>
            </div>
            <div class="recent"></div>
            <br/>

        </div>
    </div>

`

export class MyHistory extends HTMLElement {

    constructor() {
        super()
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
        
        this.dom = {
            card: doc.querySelector('.card'),
            books: doc.querySelector('.books'),
            recent: doc.querySelector('.recent'),
        }

        console.log(this.is)
        this.buildBookmarks()
        this.buildRecent()
        this.registerListeners()
    }

    buildBookmarks(){

        chrome.bookmarks.getTree(res => this.dom.books.appendChild(this.mkAccordion(res)))

    }

    buildRecent(){
        
        chrome.history.search({text:'', maxResults: 35}, res => this.dom.recent.appendChild(this.mkAccordion(res)))

    }
    mkAccordion(data){

        const accordion = document.createElement('section')
        accordion.classList.add('accordion')

        data.map(x => {

            x.children.map(x => {

            const group = document.createElement('section')
            group.classList.add('group')

            const heading = document.createElement('section')
            heading.classList.add('heading')
            
            const text = document.createElement('span')
            heading.classList.add('heading-text')
            text.textContent = x.title
            heading.appendChild(text)
            
            const chev = document.createElement('span')
            chev.classList.add('chev')
            chev.innerHTML = icons.chev
            heading.appendChild(chev)
            
            group.appendChild(heading)

            const subsection = document.createElement('section')
            subsection.classList.add('subsection')
            
                const sub = document.createElement('div')
                sub.classList.add('sub')
                
                x.children.map(x => {
                    if(x.url){
                        // extension can't point to local addresses like chrome://bookmarks
                        if(x.url.substring(0, 7) !== 'chrome:'){

                            const url = new URL(x.url)
                            const shorten = x.url.length >= 42 ? `${x.url.substring(0, 39)}...` : x.url

                            const br = document.createElement('br')
                            const cell = document.createElement('div')
                            cell.classList.add('cell')

                            const a = document.createElement('a')
                            a.href = `${x.url}`
                            a.target = "_self"
                            a.title = x.url
                            a.textContent = ''

                            const img = document.createElement('img')
                            img.src = `https://www.google.com/s2/favicons?domain=${url.hostname}`

                            const text = document.createElement('span')
                            text.textContent = x.title ? x.title : shorten

                            a.appendChild(img)
                            a.appendChild(text)

                            cell.appendChild(a)
                            
                            sub.appendChild(cell)
                        }
                        else {
                            return false
                        }
                    }
                })

                group.appendChild(sub)
                accordion.appendChild(group)
            })
        })

        return accordion
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

    }
}



customElements.define(MyHistory.is, MyHistory)

/* 

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


<div class="preview hide">
    <iframe class="frame hide" src="https://www.example.com" />
</div>


preview: doc.querySelector('.preview'),
frame: doc.querySelector('.frame')


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


        // preview
        this.dom.preview.onclick = e => {
            e.preventDefault()
            console.log('zoomzoom')
        }
        this.dom.preview.ondblclick = e => {
            e.preventDefault()
            
            console.log('ondblclick ')
            window.open(this.dom.frame.src, '_self')
        }

        //* card / clear higher things *
        this.dom.card.onclick = () => {
            console.log('card click')
            this.dom.preview.classList.add('hide')
        }
*/