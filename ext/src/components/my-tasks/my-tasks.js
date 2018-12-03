/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/my-projects/my-projects.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const icons = {
    addLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#000000" d="M7,7H11V9H7A3,3 0 0,0 4,12A3,3 0 0,0 7,15H11V17H7A5,5 0 0,1 2,12A5,5 0 0,1 7,7M17,7A5,5 0 0,1 22,12H20A3,3 0 0,0 17,9H13V7H17M8,11H16V13H8V11M17,12H19V15H22V17H19V20H17V17H14V15H17V12Z" />
    </svg>`,
    iconLink: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#000000" d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />
    </svg>`
}


const style = `
    <link rel="stylesheet" href="../shared/shared.css"/>
    <style></style>
`

const template = document.createElement('template')
template.innerHTML = `
${style}
<div class="card">
    <h2>Tasks</h2>

    <section>
        <h3>Notes</h3>
        <textarea></textarea>
        <br/><br/>
        <button class="save">Save</button>
    </section>
</div>`
export class MyTasks extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'my-tasks'
    }

    static get observedAttributes() {
        
    }

    connectedCallback() {
        //console.log('connectedCallback')
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.initElements(this.shadowRoot)
    }
    initElements(doc){
        //console.log('initElements')
        
        this.dom = {
            note: doc.querySelector('textarea'),
            save: doc.querySelector('.save')
        }

        this.dom.save.onclick = () => {
            console.log('SAVE ', this.dom.note.value)
        }
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv)
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'attr name that changed!':
        //        ov !== nv // old val not equal new val
        //        break;
        //}
    }
}
customElements.define(MyTasks.is, MyTasks)