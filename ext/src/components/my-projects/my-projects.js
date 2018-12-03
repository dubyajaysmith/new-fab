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
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
<link rel="stylesheet" href="../shared/shared.css"/>
<style>
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
.links {
    padding-inline-start: 0px;
}
.notes {
    width: 100%;
    height: 7rem;
    border-radius: 5px;
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

        <h3>Links</h3>
        <ul class="links"></ul>
        <div><input class="link" type="url" placeholder="URL to add (https://google.com)" /><span class="addLink">${icons.add}</span></div>

        <h3>Notes</h3>
        <div><textarea class="notes" placeholder="Notes for project" ></textarea></div>
        
    </div>
    <br /><br />
    <section>
        <h2>New Project</h2>
        <input class="pName" placeholder="Project Name"/>
        <br /><br />
        <button class="save">Save</button>
    </section>
</div>
`.trim()

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
        
        this.initElements(this.shadowRoot)
    }
    initElements(doc){

        chrome.storage.sync.get(['projects'], bin => 
            Array.isArray(bin.projects) ? this.buildProjects(bin) : chrome.storage.sync.set({ projects:[] }, () => console.log('setup projects')))

        this.dom = {
            projects: doc.querySelector('.projects'),
            actions: doc.querySelector('.actions'),
            delete: doc.querySelector('.delete'),
            link: doc.querySelector('.link'),
            links: doc.querySelector('.links'),
            notes: doc.querySelector('.notes'),
            addLink: doc.querySelector('.addLink'),
            tbody: doc.querySelector('tbody'),
            thead: doc.querySelector('thead'),
            pName: doc.querySelector('.pName'),
            save: doc.querySelector('.save'),
            area: doc.querySelector('.area')
        }

        this.registerListeners()
    }
    getProjects(){
        return new Promise(res => chrome.storage.sync.get(['projects'], x => res(x)))
    }
    saveProjects(projects){
        return new Promise(res => chrome.storage.sync.set({projects}, () => 
            res(`updated projects. has ${projects.length} now.`)))
    }
    updateProject(project){
        return new Promise(res => this.getProjects().then(bin => {
            
            const projects = [project, ...bin.projects.filter(x => x.name !== project.name)]
            this.saveProjects(projects).then(x => res(x))
        }))
    }
    registerListeners(){
                
        /* On Click */
        this.dom.save.onclick = () => {
            
            const name = this.dom.pName.value
            if(!name){
                console.warn('Project needs a name')
                return false
            }
            const project = {
                name, time: [], orgs: [], tasks: [], links: [], notes: ``
            }
            
            this.getProjects().then(bin => {
                
                const projects = [project, ...bin.projects]
                
                this.saveProjects(projects)
                    .then(() => this.getProjects()
                    .then(x => {
                        this.buildProjects(x)
                        this.dom.projects.value = name
                        this.dom.projects.onchange()
                    }))
            })
        }
        this.dom.delete.onclick = () => {

            const name = this.dom.projects.value
            
            if(confirm(`Sure you want to Delete ${name}?`)){
                
                this.getProjects().then(bin => {
                    
                    const projects = bin.projects.filter(x => x.name != name)
                    this.saveProjects(projects).then(x => console.log(x))
                })
            }
        }
        this.dom.addLink.onclick = () => {
            
            const link = this.dom.link.value
            if(link){
                this.project.links.push(link)
                this.updateProject(this.project)
                .then(x => {
                    console.log(x)
                    this.buildLinks()
                })
            }
        }
        
        /* On Change */
        this.dom.projects.onchange = e => {
            
            const name = this.dom.projects.value
            console.log(name)

            this.getProjects().then(bin => {
                console.dir(bin.projects)
                const project = bin.projects.filter(x => x.name == name)[0]
                console.dir(project)
                if(project){
                    this.project = project
                    this.buildLinks()
                    this.buildNotes()
                    this.dom.area.classList.add('active')
                }
                else {
                    this.dom.actions.classList.remove('active')
                }
            })
                
        }
        /* On onblur */
        this.dom.notes.onblur = e => {
            this.project.notes = this.dom.notes.value
            this.updateProject(this.project)
            .then(x => {
                console.log(x)
            })
        }
    }
    buildProjects(bin){

        const def = '--select--'
        while (this.dom.projects.lastChild) {
            this.dom.projects.removeChild(this.dom.projects.lastChild)
        }

        const opt = name => {
            const o = document.createElement('option')
            o.textContent = name
            o.id = name === def ? '' : name
            return o
        }

        this.dom.projects.appendChild(opt(def))
        bin.projects.map(x => this.dom.projects.appendChild(opt(x.name)))
    }
    buildLinks(){

        //https://docs.google.com/spreadsheets/d/1d3ObFuJbWYyr57m9aBQ-1mGkY6ckuE0S59oEJvhtHlo/edit#gid=1438171332
        console.dir('buildLinks')
        console.dir(this.project)

        while (this.dom.links.lastChild) {
            this.dom.links.removeChild(this.dom.links.lastChild)
        }
        const clean = x => x.replace('https://', '').replace('http://', '')
        const link = val => {
            const o = document.createElement('a')
            o.href = val
            o.textContent = val.length > 45 ? clean(val).substring(0, 45)+'...' : clean(val)
            return o
        }

        this.project.links.map(x => this.dom.links.appendChild(link(x)))
    }
    buildNotes(){

        console.dir('buildNotes')

        this.dom.notes.value = this.project.notes
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