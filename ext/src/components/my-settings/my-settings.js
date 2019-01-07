// jshint asi: true, esversion: 6, laxcomma: true
//'use strict()'

const style = `
<style>
        
    .card {
        border-radius: 5px;
        max-width: 100%;
        /* min-height: 20rem; */
        background: #fff;
        margin: 1rem;
        padding: 1rem;
        box-shadow: var(--shadow-low);
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    }

    .card:hover {
        box-shadow: var(--shadow-high);
        /*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
    }   
    section {
        padding: 0.1rem 0.5rem 1.5rem 0.5rem;
        border-radius: 5px;
        background: var(--grey-white);
    }
</style>
`

const template = document.createElement('template')
template.innerHTML = `
${style}
<div class="card">
    <h2>Settings</h2>
    <h3>Hey, what gives?</h3>

    <section>
        Sorry. This is still a placeholder and testing ground for features. Check back later :)
        <br/>
        <br/>
        <button class="test">Test Native App</button>
        <!--
        <h3>Modules</h3>
        <div></div>
        <button class="install">Install Module</button>
        <input class="getModule" type="file" style="display:none;" />
        -->
    </section>
</div>`

export class MySettings extends HTMLElement {
    
    constructor() {
        super()
        
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'my-settings'
    }

    static get observedAttributes() {
        
    }

    connectedCallback() {
                
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.registerElements()
    }
    registerElements(doc){ // console.log('initElements')

        this.dom = {
            test: this.shadowRoot.querySelector('.test')
            ,name: this.shadowRoot.querySelector('.name')
            ,install: this.shadowRoot.querySelector('.install')
            ,getModule: this.shadowRoot.querySelector('.getModule')
        }
        
        
        this.registerListeners()
    }
    registerListeners(){

        this.dom.test.onclick = () => {
            chrome.runtime.sendMessage({
                type: "info",
                value: "Hello there :)"
            })
            console.dir('message set');console.dir(chrome);
        }
        //this.dom.install.onclick = () => this.dom.getModule.click()
            
        /* this.dom.getModule.onchange = () => {
            const file = this.dom.getModule.files[0]
            if(!file){
                console.log('no file')
                return
            }

            //const imgurl = "https://www.google.com.hk/images/srpr/logo11w.png"
            //chrome.downloads.download({url:imgurl}, downloadId => {})
        } */
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv)
    }
}
customElements.define(MySettings.is, MySettings)