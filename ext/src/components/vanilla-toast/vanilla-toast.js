/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/vanilla-toast/vanilla-toast.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.toast {
    font-family: inherit;
    display: none;
    background: lightblue;
    padding: 1rem;
    border-radius: 5px;
    max-width: 75%;
    margin: 0 auto;
    cursor: pointer;
}
.toast > .type {
    font-size: 1.3rem;
    line-height: 1.7rem;
    padding-right: .25rem;
}
.toast > .message {
    font-size: 1rem;
    line-height: 2rem;
    padding-left: .35rem;
}
</style>

<div id="toast">
    <span id="type"></span>
    <span id="message"></span>
</div>`

export class VanillaToast extends HTMLElement {

    constructor() {
        super()
        this.timeout = 3500
        this.attachShadow({mode: 'open'})
    }

    static get is() {
        return 'vanilla-toast'
    }

    static get observedAttributes() {
        return ['type', 'message']
    }

    connectedCallback() {

        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements()
    }
    registerElements(){
        
        this.dom = {
            toast: this.shadowRoot.getElementById('.toast')
            ,type: this.shadowRoot.getElementById('type')
            ,message: this.shadowRoot.getElementById('message')
        }

		this.registerListeners()
    }
    
    pop(t, m){
        msg.textContent = m
        type.textContent = t
        show(el)
    }
    
    show(el){
        el.style.display = 'flex'
    }
    
    hide(el){
        el.style.display = 'none'
    }
    
    closeOnClick(bool){
        bool ? el.onclick = () => hide(el) : null
    }
    
    closeAuto(bool){
        this.closeAuto = bool
        bool ? setTimeout(() => hide(el), this.timeout) : null
    }

	registerListeners(){
	
        this.dom.toast.onclick = () => {
            console.log('CLICK ')
            this.closeOnClick(true)
        }

        window.addEventListener('printerstatechanged', function (e) {
            console.log('printer state changed', e.detail);
        })
	}
	
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        switch (n) {
            case 'type' || 'message':
                this.dom.type.textContent = this.getAttribute()
                break;
        }
    }
}

customElements.define(VanillaToast.is, VanillaToast);