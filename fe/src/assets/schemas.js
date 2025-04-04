export class App {
    constructor(reqPortfolio) {
        this.name = reqPortfolio.name || ''
        this.icon = reqPortfolio.icon || ''
        this.about = reqPortfolio.about || ''
        this.location = reqPortfolio.location || ''
        this.pinned = reqPortfolio.pinned || ''
        this.category = reqPortfolio.category || ''
        this.id = 'app' + Date.now()
    }
}
