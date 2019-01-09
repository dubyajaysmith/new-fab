// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

import * as sync from '../../script/sync.mjs'

const icons = {
    home: /* html */`<svg title="Home" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    delete: /* html */`<svg title="Delete" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
            <path d="M0 0h24v24H0z"/>
        </path>
    </svg>`,
    edit: /* html */`<svg title="Edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)" 
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    add: /* html */`<svg title="Add" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="var(--pink)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = /* html */`

<style>
    
button {
	background: var(--grey-dark);
	color: var(--grey-white);
	border-radius: 5px;
	padding: .5rem;
	cursor: pointer;
	outline: -webkit-focus-ring-color #FF00F0 5px;
	outline-color: var(--grey-dark);
	outline-style: auto;
	outline-width: 0px;
	border: none;
	box-shadow: var(--shadow-low);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}

button:hover {
	box-shadow: var(--shadow-high);
	/*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}

input {
	background: var(--grey-dark);
	color: var(--grey-white);
	border-radius: 5px;
	padding: .5rem;
	cursor: pointer;
	outline: -webkit-focus-ring-color #FF00F0 5px;
	outline-color: var(--grey-dark);
	outline-style: auto;
	outline-width: 0px;
	border: none;
	box-shadow: var(--shadow-low);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}

input:hover {
	box-shadow: var(--shadow-high);
	/*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}

select {
	background: var(--grey-dark);
	color: var(--grey-white);
	border-radius: 5px;
	padding: .5rem;
	cursor: pointer;
	outline: -webkit-focus-ring-color #FF00F0 5px;
	outline-color: var(--grey-dark);
	outline-style: auto;
	outline-width: 0px;
	border: none;
	box-shadow: var(--shadow-low);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}

select:hover {
	box-shadow: var(--shadow-high);
	/*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}

#card {
    margin: auto;
    margin-top: 1rem;
    max-width: 1000px;
    background: #f0f0f2;
    border-radius: 5px;
    padding: 0.2rem;
    /* border-radius: 5px; */
    border: var(--green);
    /* background: var(--green); */
    box-shadow: var(--shadow-low);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
#card:hover {
    box-shadow: var(--shadow-high);
    /*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}


#projects {
    cursor: pointer;
    font-size: 1.42rem;
}
#actions {
    cursor: pointer;
    border-radius: 5px;
    padding: 0rem 0.45rem;
}
#area {
    display: none;
}
#area.active {
    display: block;
    padding: 0.5rem;
}

#cmp-header {
    vertical-align: middle;
    display: -webkit-inline-box;
    width: -webkit-fill-available;
    padding: 0rem 0rem .25rem .5rem;
}
#cmp-header #name {
    line-height: 2;
    font-weight: 600;
    padding-right: 1.2rem;
    vertical-align: bottom;
    font-size: calc(2 * 1vmax);
}
#new {
    width: 99.4%;
    height: 2rem;
    border-radius: 5px;
    padding: .5rem 0rem 0rem .5rem;
}
#new > input, .new > svg {
    vertical-align: middle;
}
#new > input {
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

    <div id="card">
        <div id="container">
            <div id="cmp-header">
                <span id="name">Projects</span>
                <div id="new">
                    <input id="pName" placeholder="New Project Name..." />
                    <span id="save">${icons.add}</span>
                </div>
            </div>
            <div id="actions">
                <select id="projects"></select>
                <span id="delete">${icons.delete}</span>
            </div>
        </div>
        <br />

        <div id="area">
            
            <project-tasks id="tasks"></project-tasks>
            <br /><br />

            <fab-notes id="notes" mode="project"></fab-notes>
            <br /><br />

            <fab-links id="links"></fab-links>
            <br />

        </div>
    </div>
`

export class FabProjects extends HTMLElement {
    
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'fab-projects'
    }

    static get observedAttributes() {
        return ['projects']
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))        
        this.initElements(this.shadowRoot)
    }

    initElements(doc){

        sync.project.getAll().then(bin => 
            Array.isArray(bin.projects) ? this.buildProjects(bin) : chrome.storage.sync.set({ projects:[] }))

        this.dom = {
            container: doc.getElementById('container'),
            projects: doc.getElementById('projects'),
            actions: doc.getElementById('actions'),
            delete: doc.getElementById('delete'),
            pName: doc.getElementById('pName'),
            save: doc.getElementById('save'),
            area: doc.getElementById('area'),
            task: doc.getElementById('tasks'),
            links: doc.getElementById('links'),
            notes: doc.getElementById('notes'),
        }
        //document.getElementsByTagName('project-tasks')
        this.registerListeners()
    }
        
    registerListeners(){
        
        /* On Click */
        
        this.dom.save.onclick = () => {
            
            const name = this.dom.pName.value
            this.selected = name

            if(!name){
                console.warn('Project needs a name')
                return false
            }

            this.dom.pName.value = ''
            
            const project = {
                name, time: [], orgs: [], tasks: [], links: [], notes: ``
            }
            
            sync.project.getAll().then(bin => {
                
                const projects = [project, ...bin.projects]
                
                sync.project.save(projects)
                    .then(() => sync.project.getAll())
                    .then(x => {
                        this.buildProjects(x)
                        this.dom.projects.value = name
                        this.dom.projects.onchange()
                    })
            })
        }
        // also save on enter
        this.dom.pName.onkeyup = e => e.keyCode == 13 && this.dom.pName.value ? this.dom.save.onclick() : null

        this.dom.delete.onclick = () => {

            const name = this.dom.projects.value
            
            if(confirm(`Sure you want to Delete ${name}?`)){
                
                sync.project.getAll().then(bin => {
                    
                    const projects = bin.projects.filter(x => x.name != name)
                    sync.project.saveAll(projects).then(x => console.log(x))
                })
            }
        }

        /* clear higher things */
        //this.dom.container.onclick = () => {
        //    this.dom.links.setAttribute("preview", "hide")
        //}

        
        /* On Change */
        this.dom.projects.onchange = e => {
            
            const name = this.dom.projects.value

            sync.project.getAll().then(bin => {

                if(bin.projects){

                    const project = bin.projects.filter(x => x.name == name)[0]

                    this.project = project
                    console.dir(project)

                    this.dom.area.classList.add('active')
                    
                    this.dom.task.setAttribute("project", name)
                    this.dom.notes.setAttribute("notes", project.notes)
                    this.dom.links.setAttribute("project", name)
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

        this.dom.notes.addEventListener('save', e => {
            
            if(e.detail.mode == 'project'){
                sync.project.get(this.dom.projects.value).then(pj => {
                    pj.notes = e.detail.note
                    sync.project.save(pj)
                })
            }
        })
    }
}
customElements.define(FabProjects.is, FabProjects);