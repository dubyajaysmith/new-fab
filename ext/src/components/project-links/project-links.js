/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/project-links/project-links.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const icons = {
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="var(--green)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = {
    css: `

        .cmp-container {
            border-radius: 5px;
            box-shadow: var(--shadow-low);
            background: var(--grey-lightest);
            border: 1px solid var(--grey-light);
        }
        .cmp-header {
            width: -webkit-fill-available;
            vertical-align: middle;
            display: -webkit-inline-box;
            padding: 0rem 0rem .25rem .5rem;
        }
        .cmp-header > .name {
            line-height: 2;
            font-weight: 600;
            font-size: 1.5rem;
            padding-right: 1.2rem;
            vertical-align: bottom;
        }

        .new {
            width: 99.4%;
            height: 2rem;
            border-radius: 5px;
            padding: .5rem 0rem 0rem .5rem;
        }
        .new > input, .new > svg {
            vertical-align: middle;
        }
        .new > input {
            width: 7rem;
            max-width: 420px;    
            vertical-align: bottom;
        	transition: all 1s cubic-bezier(.25, .8, .25, 1);
        }
        
        .item:last-child {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .item > input[type=checkbox] {
            transform: scale(2);
            fill: var(--green);
            transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        }
        .item > input[type=checkbox]:hover, .item > input[type=checkbox].active {
            transform: scale(3);
            -webkit-filter: var(--shadow-drop);
            filter: var(--shadow-drop);
        }
        .item > input[type=number] {
            width: 5rem;
            height: 1.75rem;
            margin-left: 2rem;
            vertical-align: super;
        }
        .item:nth-child(odd) {
            border: var(--grey-light);
            background: var(--grey-light);
        }
        .item:nth-child(even) {
            border: var(--grey-lightest);
            background: var(--grey-lightest);
        }

        svg {
            cursor: pointer;
            fill: var(--green);
            transform: scale(1);
            transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        }
        svg:hover, svg.active {
            transform: scale(2);
            filter: var(--shadow-drop);
            -webkit-filter: var(--shadow-drop);
        }

        input[type=checkbox]+label {
            margin: 0.2em;
            padding: 0.2em;
            cursor: pointer;
            font-size: 1.25rem;
            display: inline-block;
        }
        input[type=checkbox] {
            display: none;
        }
        input[type=checkbox]+label:before {
            width: 1em;
            height: 1em;
            content: "\\2714";
            border: 0.1em solid #000;
            border-radius: 0.2em;
            display: inline-block;
            padding-left: 0.2em;
            padding-bottom: 0.3em;
            margin-right: 0.2em;
            vertical-align: bottom;
            color: transparent;
            transition: .2s;
        }
        input[type=checkbox]+label:active:before {
            transform: scale(0);
        }
        input[type=checkbox]:checked+label:before {
            background-color: var(--green);
            border-color: var(--green);
            color: #fff;
        }
        input[type=checkbox]:disabled+label:before {
            transform: scale(1);
            border-color: #aaa;
        }
        input[type=checkbox]:checked:disabled+label:before {
            transform: scale(1);
            background-color: #bfb;
            border-color: #bfb;
        }

        .addLink {
            cursor: pointer;
        }
        .links {
            padding-inline-start: 0px;
        }
        .hide {
            display: none;
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
    `,
    links: `<link rel="stylesheet" href="../shared/shared.css"/>`
}

const template = document.createElement('template')
template.innerHTML = /* template */`

    ${style.links}
    <style>${style.css}</style>

    <div class="cmp-container">
        
        <div class="cmp-header">
            <span class="name">Links</span>
            <div class="new">
                <input class="link" placeholder="Paste new link to save..." type="url" />
                <span class="addLink">${icons.add}</span>
            </div>
        </div>
        
        <ul class="links"></ul>
        
        <div class="preview hide">
            <iframe class="frame hide" src="https://www.example.com" />
        </div>
    </div>
`

export class ProjectLinks extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'project-links'
    }

    static get observedAttributes() {
        return ['project', 'preview', 'links']
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){
        
        this.dom = {
            addLink: doc.querySelector('.addLink'),
            link: doc.querySelector('.link'),
            links: doc.querySelector('.links'),
            preview: doc.querySelector('.preview'),
            frame: doc.querySelector('.frame')
        }

        this.registerListeners()
    }
    registerListeners(){
        
        this.dom.addLink.onclick = () => {
            
            const link = this.dom.link.value
            if(link){
                this.dom.link.value = ''
                this.saveLink(link)
            }
        }


        this.dom.link._width = this.dom.link.style.width
        this.dom.link.onfocus = () => this.dom.link.style.width = `50%`
        this.dom.link.onblur = () => this.dom.link.style.width = this.dom.link._width
    }
    
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case 'project':
                this.getProject(nv)
                .then(pj => this.rerenderLinks(pj.links))
            break
            case 'links':
                console.log(nv)
                this.rerenderLinks(nv)
            break
            case 'preview':
                this.dom.preview.classList.add(nv)
            break
        }
    }

    rerenderLinks(links){

        while (this.dom.links.lastChild) {
            this.dom.links.removeChild(this.dom.links.lastChild)
        }

        links.map(x => this.renderLink(x))
    }

    saveLink(link){
        this.getProject(this.getAttribute('project')).then(pj => {
            pj.links.push(link)
            this.updateProject(pj)
            this.renderLink(link)
        })
    }
    getProject(name){
        return new Promise(res => chrome.storage.sync.get(['projects'], bin => res(bin.projects.filter(x => x.name === name)[0])))
    }
    saveProjects(projects){
        return new Promise(res => chrome.storage.sync.set({projects}, () => 
            res(`updated projects. has ${projects.length} now.`)))
    }
    getProjects(){
        return new Promise(res => chrome.storage.sync.get(['projects'], x => res(x)))
    }
    updateProject(project){
        return new Promise(res => this.getProjects().then(bin => {
            
            const projects = [project, ...bin.projects.filter(x => x.name !== project.name)]
            this.saveProjects(projects).then(x => res(x))
        }))
    }

    renderLink(url){

        const li = document.createElement('li')
        li.classList.add('item')
        
        const o = document.createElement('a')
        o.href = url
        o.textContent = url.length > 50 ? `${url.substring(0, 50)}...` : url
        
        o.onmouseover = e => {
        
            if (this.dom.frame.src != o.href) {
            
                this.dom.frame.classList.remove('hide')
                this.dom.frame.src = o.href
                this.dom.frame.onload = () => {
                    this.dom.preview.width  = this.dom.frame.contentWindow.document.body.scrollWidth
                    this.dom.preview.height = this.dom.frame.contentWindow.document.body.scrollHeight                    
                    this.dom.frame.width  = this.dom.frame.contentWindow.document.body.scrollWidth
                    this.dom.frame.height = this.dom.frame.contentWindow.document.body.scrollHeight
                
                }
                this.dom.frame.contentWindow.location.reload(true)
            }
            this.dom.preview.classList.remove('hide')
        }
                
        li.appendChild(o)
        
        this.dom.links.appendChild(li)
    }
}
// input[type number] doesn't increment by mousewheel without
window.addEventListener('mousewheel', e => {})

customElements.define(ProjectLinks.is, ProjectLinks)