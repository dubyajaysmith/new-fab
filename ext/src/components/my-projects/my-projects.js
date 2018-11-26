// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const icons = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="aquamarine"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="aquamarine"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
            <path d="M0 0h24v24H0z"/>
        </path>
    </svg>`,
    pen: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="aquamarine" 
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    add: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="aquamarine" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = `
<style>
.card {
    border-radius: 5px;
    max-width: 100%;
    min-height: 20rem;
    background: #fff;
    margin: 1rem;
	padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
.card:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.projects {
    cursor: pointer;
    font-size: 1.42rem;
}
.actions {
    float: right;
    cursor: pointer;
    background: grey;
    border-radius: 5px;
    padding: 0rem 1rem;
}
.area {
    display: none;
}
.area.active {
    display: block;
    background: #f2f2f2;
    padding: 0.5rem;
}
.addLink {
    cursor: pointer;
}
</style>
`


const template = document.createElement('template')
//template.innerHTML = `<div class="card"><div class="header"></div><table><thead></thead><tbody></tbody></table></div>`
template.innerHTML = `
${style}
<div class="card">
    <h2>Projects</h2>
    <select class="projects"></select>
    <div class="area">
        
        <div class="actions">
            <span class="delete">${icons.delete}</span>
        </div>

        <h3>Links <span class="addLink">${icons.add}</span></h3>
        <ul class="links"></ul>
        
    </div>
</div>

<div class="card">
    <h2>New Project</h2>
    <input class="pName" placeholder="Project Name"/>
    <br />
    <button class="save">Save</button>
</div>`

export class MyProjects extends HTMLElement {
    
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'my-projects'
    }

    static get observedAttributes() {
        return ['projects']
    }

    connectedCallback() {
        console.log('connectedCallback')
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){

        chrome.storage.sync.get(['projects'], bin => 
            Array.isArray(bin.projects) ? this.buildProjects(bin) : chrome.storage.sync.set({ projects:[] }, () => console.log('setup projects')))

        this.dom = {
            projects: doc.querySelector('.projects'),
            actions: doc.querySelector('.actions'),
            delete: doc.querySelector('.delete'),
            links: doc.querySelector('.links'),
            addLink: doc.querySelector('.addLink'),
            tbody: doc.querySelector('tbody'),
            thead: doc.querySelector('thead'),
            pName: doc.querySelector('.pName'),
            save: doc.querySelector('.save'),
            area: doc.querySelector('.area')
        }

        this.registerListeners()
    }
    saveProjects(projects){
        return new Promise(res => chrome.storage.sync.set({projects}, () => 
            res(`updated projects. has ${projects.length} now.`)))
    }
    getProjects(){
        return new Promise(res => chrome.storage.sync.get(['projects'], x => res(x)))
    }
    registerListeners(){
                
        /* On Click */
        this.dom.save.onclick = () => {
            
            const name = this.dom.pName.value
            if(!name){
                console.warn('Project needs a name')
                return
            }
            const project = {
                name, time: [], orgs: [], tasks: [], links: [],
            }
            
            this.getProjects().then(bin => {
                
                const projects = [project, ...bin.projects]
                
                this.saveProjects(projects)
                    .then(() => this.getProjects()
                    .then(x => this.buildProjects(x)))
            })
        }
        this.dom.delete.onclick = () => {

            const name = this.dom.projects.value
            
            if(confirm(`Sure you want to Delete ${name}?`)){
                const save = projects => this.saveProjects(projects).then(x => console.log(x))
                this.getProjects().then(bin => {
                    
                    const projects = bin.projects.filter(x => x.name !== name)
                    save(projects)
                })
            }
        }
        this.dom.addLink.onclick = () => {

            console.log('todo => add link')
        }
        
        /* On Change */
        this.dom.projects.onchange = e => {
            
            const name = this.dom.projects.value

            this.getProjects().then(bin => {
                
                const project = bin.projects.reduce((a,c) => c.name == name ? c : null)
                console.dir(project)
                if(project){
                    this.buildLinks(project)
                    this.dom.area.classList.add('active')
                }
                else {
                    this.dom.actions.classList.remove('active')
                }
            })
                
        }
    }
    buildProjects(bin){

        while (this.dom.projects.lastChild) {
            this.dom.projects.removeChild(this.dom.projects.lastChild)
        }

        const opt = name => {
            const o = document.createElement('option')
            o.textContent = name
            o.id = name === 'Select Project' ? '' : name
            return o
        }

        this.dom.projects.appendChild(opt('Select Project'))
        bin.projects.map(x => this.dom.projects.appendChild(opt(x.name)))
    }
    buildLinks(project){

        while (this.dom.links.lastChild) {
            this.dom.links.removeChild(this.dom.links.lastChild)
        }

        const link = val => {
            const o = document.createElement('a')
            o.href = val
            return o
        }

        project.links.map(x => this.dom.links.appendChild(link(x)))
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'text':
        //        this._text = nv;
        //        this.setText(ov, nv);
        //        break;
        //}
    }
}
customElements.define(MyProjects.is, MyProjects);