// jshint asi: true, esversion: 6, laxcomma: true
//'use strict()'

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
</style>
`

const template = document.createElement('template')
template.innerHTML = `
${style}
<div class="card">
    <h2>Settings</h2>
    <h3>todo : load other components, theme</h3>
</div>`

export class MySettings extends HTMLElement {
    
    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'my-settings';
    }

    static get observedAttributes() {
        
    }

    connectedCallback() {
        console.log('my-settings connected')
        this.shadowRoot.appendChild(template.content.cloneNode(true))
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
customElements.define(MySettings.is, MySettings);