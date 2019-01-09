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
            <span class="name"></span>
        </div>
        <textarea class="notes" placeholder="Add Some Notes..." ></textarea>

    </div>
`

export class FabNotes extends HTMLElement {

    constructor() {
        super()
        this.mode = this.getAttribute('mode')
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'fab-notes'
    }

    static get observedAttributes() {
        return ['mode', 'notes', 'title']
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){
        
        this.dom = {
            title: doc.querySelector('.name'),
            notes: doc.querySelector('.notes')
        }
        const title = `${this.mode ? this.mode.charAt(0).toUpperCase() + this.mode.slice(1) : ''} Notes`
        this.dom.title.textContent = title
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
            case 'notes':
                this.renderNotes(nv)
            break
            case 'mode':
                this.mode = nv
            break
            case 'title': 
                this.dom.title.textContent = nv
            break
        }
    }

    updateNotes(note){
        
        const detail = { note, mode: this.mode }
        const e = new CustomEvent('save', { detail })

        this.dispatchEvent(e)
    }
}

customElements.define(FabNotes.is, FabNotes)