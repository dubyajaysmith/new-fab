/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/project-notes/project-notes.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const icons = {
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="var(--green)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = /* html */`
    
<style>

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
        padding: 0rem 0rem .25rem .5rem;
    }
    .cmp-header > .name {
        color: var(--grey-dark);
        line-height: 2;
        font-weight: 600;
        font-size: 1.5rem;
        padding-right: 1.2rem;
        vertical-align: bottom;
    }

    .notes {
        border:none;
        height: 8rem;
        background: inherit;
        max-width: inherit;
        width: 100% !important;
        min-width: 100% !important;
        border-radius: 0px 0px 5px 5px;
    }
    .notes:focus {
        outline: none;
    }
</style>`

const template = document.createElement('template')
template.innerHTML = /* template */`

    ${style}

    <div class="cmp-container">
        
        <div class="cmp-header">
            <span class="name">Notes</span>
        </div>
        <textarea class="notes" placeholder="Notes for project" ></textarea>

    </div>
`

export class ProjectLinks extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'project-notes'
    }

    static get observedAttributes() {
        return ['project', 'notes']
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){
        
        this.dom = {
            notes: doc.querySelector('.notes')
        }

        this.registerListeners()
    }

    registerListeners(){
        /* On onblur */
        this.dom.notes.onblur = () => this.updateNotes(this.dom.notes.value)
    }

    renderNotes(note){
        this.dom.notes.value = note
    }
    
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case 'project':
                this.getProject(nv)
                .then(pj => this.renderNotes(pj.notes))
            break
            case 'notes':
                this.renderNotes(nv)
            break
        }
    }

    updateNotes(note){
        this.getProject(this.getAttribute('project')).then(pj => {
            pj.notes = note
            this.updateProject(pj)
        })
    }
    
    getProject(name){
        return new Promise(res => chrome.storage.sync.get(['projects'], bin => res(bin.projects.filter(x => x.name === name)[0])))
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

}

customElements.define(ProjectLinks.is, ProjectLinks)