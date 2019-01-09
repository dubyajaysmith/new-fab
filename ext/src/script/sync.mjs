// jshint asi: true, esversion: 6, laxcomma: true 
'use strict()'

const project = {

    get: function(name) {
        return new Promise(res => chrome.storage.sync.get(['projects'], bin => 
            res(bin.projects.filter(x => x.name === name)[0])))
    },
    getAll: function() {
        return new Promise(res => chrome.storage.sync.get(['projects'], x => res(x)))
    },
    save: function(project) {
        return new Promise(res => this.getAll().then(bin => {
            
            const projects = [project, ...bin.projects.filter(x => x.name !== project.name)]
            this.saveAll(projects).then(x => res(x))
        }))
    },
    saveAll: function(projects) {
        return new Promise(res => chrome.storage.sync.set({projects}, () => res(projects)))
    }
}

export { project }