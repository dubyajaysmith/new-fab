/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/project-tasks/project-tasks.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const icons = {
    chev: `<svg viewBox="0 0 20 20" width="20" height="20">
        <title>cheveron down</title>
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
    </svg>`,
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
    add: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="aquamarine" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <path fill="none" d="M0 0h24v24H0z"></path>
    </svg>`
}




const template = document.createElement('template')
template.innerHTML = `
<link rel="stylesheet" href="../shared/shared.css"/>

<style>
.card {
	padding: 1rem;
    border-radius: 5px;
    max-width: 100%;
    min-height: 20rem;
    background: #EEE;
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
    width: 35%;
    max-width: 420px;
}

.items, .item:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.items:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.item > input[type=checkbox] {
    transform: scale(2);
	fill: var(--green);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
.item > input[type=checkbox]:hover, .item > input[type=checkbox].active {
	transform: scale(3);
	-webkit-filter: var(--shadow-drop);
	filter: var(--shadow-drop);
}
.item > input[type=number] {
    width: 5rem;
    height: 1.75rem;
    margin-left: 2rem;
    vertical-align: super;
}
.items:nth-child(odd) {
  background: lightgrey;
  border: lightgrey;
}
.items:nth-child(even) {
  background: lightblue;
  border: lightblue;
}

svg {
	cursor: pointer;
	transform: scale(1);
	fill: var(--green);
	transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
svg:hover, svg.active {
	transform: scale(2);
	-webkit-filter: var(--shadow-drop);
	filter: var(--shadow-drop);
}

input[type=checkbox]+label {
    display: inline-block;
    font-size: 1.25rem;
    margin: 0.2em;
    cursor: pointer;
    padding: 0.2em;
}

input[type=checkbox] {
	display: none;
}

input[type=checkbox]+label:before {
	content: "\\2714";
	border: 0.1em solid #000;
	border-radius: 0.2em;
	display: inline-block;
	width: 1em;
	height: 1em;
	padding-left: 0.2em;
	padding-bottom: 0.3em;
	margin-right: 0.2em;
	vertical-align: bottom;
	color: transparent;
	transition: .2s;
}

input[type=checkbox]+label:active:before {
	transform: scale(0);
}

input[type=checkbox]:checked+label:before {
	background-color: var(--green);
	border-color: var(--green);
	color: #fff;
}

input[type=checkbox]:disabled+label:before {
	transform: scale(1);
	border-color: #aaa;
}

input[type=checkbox]:checked:disabled+label:before {
	transform: scale(1);
	background-color: #bfb;
	border-color: #bfb;
}
</style>

<h3>Tasks</h3>
<div class="tasks">
    <div class="new">
        <input class="title" placeholder="Your task todo" />
        <span class="add">${icons.add}</span>
    </div>
    <br />
    <div class="items">
    </div>
</div>`

export class ProjectTasks extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.tasks = []
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'project-tasks'
    }

    static get observedAttributes() {
        return ['project', 'items']
    }

    connectedCallback() {
        //console.log('connectedCallback')
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
    registerElements(doc){
        //console.log('registerElements')
        console.log('ProjectTasks')
        
        this.dom = {
            title: doc.querySelector('.title'),
            new: doc.querySelector('.new'),
            add: doc.querySelector('.add'),
            items: doc.querySelector('.items')
        }

        this.dom.add.onclick = () => {
                
            const task = {
                time: 0,
                date: null,
                status: false,
                title: this.dom.title.value,
                uid: new Date().getTime()
            }
            
            this.dom.title.value = ''

            this.saveTask(task)

        }
    }

    renderTask(task){

        this.tasks.push(task)

        console.log('create task-item ', task.title)

        const div = document.createElement('div')
        div.classList.add('item')
        
        const check = document.createElement('input')
        check.type = 'checkbox'
        check.id = task.uid
        if(task.status){
            check.checked = true
            check.setAttribute("checked", true)
        }
        check.onchange = e => {
            task.status = check.checked
            task.date = new Date().getTime()
            this.updateTask(task)
        }
        div.appendChild(check)
        
        const label = document.createElement('label')
        label.setAttribute("for", check.id)
        label.textContent = task.title
        div.appendChild(label)
        
        const number = document.createElement('input')
        number.type = 'number'
        number.step = '.5'
        number.value = task.time
        number.onblur = () => {
            task.time = number.value
            this.updateTask(task)
        }
        div.appendChild(number)
        
        this.dom.items.appendChild(div)
    }
    
    attributeChangedCallback(n, ov, nv) {
        console.log('hit')
        //super.attributeChangedCallback(n, ov, nv)
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        switch (n) {// n, ov, nv == attrib name, old val, new val
            case 'project':
                this.getProject(nv)
                .then(pj => {
                    // sort by status => status == true ? append : prepend
                    const na = pj.tasks.filter(x => !x.status)
                    const done = pj.tasks.filter(x => x.status)
                    const tasks = [...na, ...done]
                    tasks.map(x => this.renderTask(x))
                })
            break
        }
    }

    saveTask(task){
        this.getProject(this.getAttribute('project')).then(pj => {
            pj.tasks.push(task)
            this.updateProject(pj)
            this.renderTask(task)
        })
    }
    updateTask(task){
        this.getProject(this.getAttribute('project')).then(pj => {
            const rest = pj.tasks.filter(x => x.uid != task.uid)
            const tasks = [task, ...rest]
            pj.tasks = tasks
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
// input[type number] doesn't increment by mousewheel without
window.addEventListener('mousewheel', e => {})

customElements.define(ProjectTasks.is, ProjectTasks)