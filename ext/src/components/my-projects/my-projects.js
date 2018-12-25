// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const icons = {
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--green)"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--green)"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
            <path d="M0 0h24v24H0z"/>
        </path>
    </svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--green)" 
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="var(--green)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = /* html */`

<link rel="stylesheet" href="../shared/shared.css"/>
<style>
.projects {
    cursor: pointer;
    font-size: 1.42rem;
}
.actions {
    cursor: pointer;
    border-radius: 5px;
    padding: 0rem 1rem;
}
.area {
    display: none;
}
.area.active {
    display: block;
    padding: 0.5rem;
}

.cmp-header {
    vertical-align: middle;
    display: -webkit-inline-box;
    width: -webkit-fill-available;
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
</style>
`

const template = document.createElement('template')
template.innerHTML = /* html */`

    ${style}
    
    <div class="card">
        <div class="container">
            <div class="cmp-header">
                <span class="name">Projects</span>
                <div class="new">
                    <input class="pName" placeholder="New Project Name..." />
                    <span class="save">${icons.add}</span>
                </div>
            </div>
            <div class="actions">
                <select class="projects"></select>
                <span class="delete">${icons.delete}</span>
            </div>
        </div>
        <br />

        <div class="area">
            
            <project-tasks></project-tasks>
            <br /><br />

            <project-notes></project-notes>
            <br /><br />

            <project-links></project-links>
            <br />

        </div>
    </div>
`

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
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))        
        this.initElements(this.shadowRoot)
    }

    initElements(doc){

        chrome.storage.sync.get(['projects'], bin => 
            Array.isArray(bin.projects) ? this.buildProjects(bin) : chrome.storage.sync.set({ projects:[] }))

        this.dom = {
            card: doc.querySelector('.card'),
            projects: doc.querySelector('.projects'),
            actions: doc.querySelector('.actions'),
            delete: doc.querySelector('.delete'),
            pName: doc.querySelector('.pName'),
            save: doc.querySelector('.save'),
            area: doc.querySelector('.area'),
            task: doc.querySelector('project-tasks'),
            links: doc.querySelector('project-links'),
            notes: doc.querySelector('project-notes')
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

            this.dom.pName.value = ''
            
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

        /* card / clear higher things */
        this.dom.card.onclick = () => {
            this.dom.links.setAttribute("preview", "hide")
        }

        
        /* On Change */
        this.dom.projects.onchange = e => {
            
            const name = this.dom.projects.value

            this.getProjects().then(bin => {

                const project = bin.projects.filter(x => x.name == name)[0]

                if(project){
                    this.project = project

                    this.dom.area.classList.add('active')
                    
                    this.dom.task.setAttribute("project", name)
                    this.dom.notes.setAttribute("project", name)
                    this.dom.links.setAttribute("project", name)
                    //this.dom.links.setAttribute("links", project.links)
                }
                else {
                    this.dom.actions.classList.remove('active')
                }
            })

            localStorage.selected_project = this.dom.projects.options.selectedIndex
        }

        this.dom.pName._width = this.dom.pName.style.width
        this.dom.pName.onfocus = () => this.dom.pName.style.width = `40%`
        this.dom.pName.onblur = () => this.dom.pName.style.width = this.dom.pName._width

        this.ready()
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
    
    attributeChangedCallback(n, ov, nv) {
        //super.attributeChangedCallback(n, ov, nv)
    }
    ready(){
        setTimeout(() => {
            this.dom.projects.options.selectedIndex = localStorage.selected_project
            this.dom.projects.onchange()
        }, 0)
    }
}
customElements.define(MyProjects.is, MyProjects);