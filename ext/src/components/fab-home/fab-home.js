// jshint asi: true, esversion: 6, laxcomma: true
'use strict()'

const icons = {
    home: `<svg title="Home" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    delete: `<svg title="Delete" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
            <path d="M0 0h24v24H0z"/>
        </path>
    </svg>`,
    edit: `<svg title="Edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="var(--pink)" 
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z">
        </path>
    </svg>`,
    add: `<svg title="Add" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path fill="var(--pink)" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}

const style = /* html */`

<style>
    


</style>
`

const template = document.createElement('template')
template.innerHTML = /* html */`

    ${style}

    <fab-projects></fab-projects>

    <fab-calendar></fab-calendar>
`

export class FabHome extends HTMLElement {
    
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'fab-home'
    }

    static get observedAttributes() {
        return []
    }

    connectedCallback() {
        
        this.shadowRoot.appendChild(template.content.cloneNode(true))        
        this.initElements(this.shadowRoot)
    }

    initElements(){

        this.dom = {
            card: this.shadowRoot.getElementById('card'),
        }
        
        this.registerListeners()
    }
    
    registerListeners(){
        
    }
    
    attributeChangedCallback(n, ov, nv) {
        //super.attributeChangedCallback(n, ov, nv)
    }
}
customElements.define(FabHome.is, FabHome);