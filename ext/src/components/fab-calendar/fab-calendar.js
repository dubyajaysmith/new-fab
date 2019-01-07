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
#cmp-header #name {
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
}
</style>
`

const template = document.createElement('template')
template.innerHTML = /*html*/`

${style}

<div id="card">
    <div id="container">
        <div id="cmp-header">
            <span id="name">Calendar</span>
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
            calendar: this.shadowRoot.querySelector('tbody')
        }
	    
		this.registerListeners()
    }
	registerListeners(){
        
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

        this.today = new Date()
        this.currentMonth = this.today.getMonth()
        this.currentYear = this.today.getFullYear()
        //this.selectYear = document.getElementById("year")
        //this.selectMonth = document.getElementById("month")

        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        //let monthAndYear = document.getElementById("monthAndYear")
        this.showCalendar(this.currentMonth, this.currentYear)
    }

    
    showCalendar(month, year) {

        const firstDay = (new Date(year, month)).getDay()
        const daysInMonth = 32 - new Date(year, month, 32).getDate()

        // clearing all previous cells
        this.dom.calendar.innerHTML = ''

        // filing data about month and in the page via DOM.
        this.dom.header.textContent = `${this.months[month]} ${year}`
        this.selectYear = year
        this.selectMonth = month

        // creating all cells
        let date = 1
        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = document.createElement("tr")

            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement("td")
                    let cellText = document.createTextNode("")
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                }
                else if (date > daysInMonth) {
                    break
                }
                else {

                    let cell = document.createElement("td")
                    let cellText = document.createTextNode(date)
                    if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
                        cell.id = 'today'
                    } // color today's date
                    cell.onclick = () => cell.textContent ? this.getDate(Number(cell.textContent)) : null
                    cell.appendChild(cellText)
                    row.appendChild(cell)
                    date++
                }
            }

            this.dom.calendar.appendChild(row) // appending each row into calendar body.
        }
    }
    getDate(n){
        console.log(`${n}/${this.currentMonth+1}/${this.currentYear}`)
    }
    
}
customElements.define(FabCalendar.is, FabCalendar)