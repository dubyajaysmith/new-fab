/*
* Use tag to import via es6 module (html import depricated in v1 spec :/ )
* <script type="module" src="../components/projects-calendar/projects-calendar.js"></script>
*/
// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const style = /* html */`
<style>

#card {
    margin: auto;
    margin-top: 2rem;
    max-width: 1000px;
    background: #f0f0f2;
    border-radius: 5px;
    padding: 0.2rem;
    /* border-radius: 5px; */
    border: var(--green);
    background: var(--green);
    box-shadow: var(--shadow-low);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
#card:hover {
    box-shadow: var(--shadow-high);
    /*  0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22); */
}

#container{

}
#cmp-header {
    vertical-align: middle;
    display: -webkit-inline-box;
    width: -webkit-fill-available;
    padding: 0rem 0rem .25rem .5rem;
}
#cmp-header .title {
    color: #FFF;
    line-height: 2;
    font-weight: 600;
    padding-right: 1.2rem;
    vertical-align: bottom;
    font-size: calc(2 * 1vmax);
}

#actions {
    cursor: pointer;
    background: white;
    border-radius: 5px;
    padding: 1rem 0.45rem;
}

table {
    width: 100%;
    border-spacing: 0px;
    border-collapse: separate;
}
th {
    border-bottom: 1pt solid var(--pink);
}
tbody {
    text-align: center;
}
tbody > tr > td {
    cursor: pointer;
    border: 1pt solid var(--grey-light)
}

#today {
    background: var(--green);
    border: 1pt solid var(--green);
    color: white;
}

/*#notes {
    margin-top: 1vh;
    width: 100%;
    height: 75px;
    background: #00ffd2;
    border-radius: 5px;
    border: 1pt solid #00BC9D;
    background-color: #00BC9D;
    color: white;
}*/
</style>
`

const template = document.createElement('template')
template.innerHTML = /*html*/`

${style}

<div id="card">
    <div id="container">
        <div id="cmp-header">
            <span class="title">Track Calendar</span>
        </div>
        <div id="actions">
            <table>
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tues</th>
                        <th>Wed</th>
                        <th>Thur</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <br />
            <fab-notes id="notes" mode="calendar"></fab-notes>
        </div>
    </div>
</div>`

export class FabCalendar extends HTMLElement {

    constructor() {
        super()
        //console.log('hi from constructor')
        this.attachShadow({mode: 'open'})
    }
    static get is() {
        return 'fab-calendar'
    }

    static get observedAttributes() {
        return ['data']
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.registerElements(this.shadowRoot)
    }
    registerElements(){
        //console.log('registerElements')
        
        this.dom = {
            header: this.shadowRoot.getElementById('name'),
            notes: this.shadowRoot.getElementById('notes'),
            calendar: this.shadowRoot.querySelector('tbody')
        }
	    
		this.registerListeners()
    }
	registerListeners(){
        
        this.dom.notes.addEventListener('save', e => {
            
            if(e.detail.mode == 'calendar'){
                console.log('todo: save note based on day')
                console.dir(e)
                //sync.project.get(this.dom.projects.value).then(pj => {
                //    pj.notes = e.detail.note
                //    sync.project.save(pj)
                //})
            }
        })

        this.init()
	}
	
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv)
        console.dir(n)
        console.dir(ov)
        console.dir(nv)
        //switch (n) {
        //    case 'attr name that changed!':
        //        ov !== nv // old val not equal new val
        //        break
        //}
    }

    init(){

        this.selectedDate = new Date()
        this.selectedMonth = this.selectedDate.getMonth()
        this.selectedYear = this.selectedDate.getFullYear()

        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        //let monthAndYear = document.getElementById("monthAndYear")
        this.showCalendar(this.selectedMonth, this.selectedYear)
    }

    
    showCalendar(month, year) {
        console.log(month, year)
        const firstDay = (new Date(year, month)).getDay()
        const daysInMonth = 32 - new Date(year, month, 32).getDate()

        // clear previous cells
        this.dom.calendar.innerHTML = ''

        // filing data about month and in the page via DOM.
        this.dom.notes.setAttribute('title', `${this.months[month]} ${this.selectedDate.getDay()}, ${year}`)

        // creating all cells
        let date = 1
        for (let i = 0; i < 5; i++) {
            // creates a table row
            const row = document.createElement("tr")

            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                
                if ((i === 0 && j < firstDay) || date > daysInMonth) {
                    const cell = document.createElement("td")
                    const cellText = document.createTextNode("")
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                }
                else {

                    const cell = document.createElement("td")
                    const cellText = document.createTextNode(date)
                    if (date === this.selectedDate.getDate() && year === this.selectedDate.getFullYear() && month === this.selectedDate.getMonth()) {
                        cell.id = 'today'
                    } // color today's date
                    cell.onclick = e => cell.textContent ? this.changeDate(cell.textContent, this.selectedMonth, this.selectedYear, e) : null
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                    date++
                }
            }

            this.dom.calendar.appendChild(row) // appending each row into calendar body.
        }
    }
    changeDate(day, month, year, event){

        this.dom.notes.setAttribute('title', `${this.months[month]} ${day} Notes`)
        
        if(day){
            this.dom.calendar.querySelector('#today').id = ''
            //this.dom.header.textContent = `${this.months[month]} ${day} Notes`
        }
        
        if(month && year){
            showCalendar(month, year)
        }

        if(event){
            event.target.id = 'today'
        }
    }
    
}
customElements.define(FabCalendar.is, FabCalendar)