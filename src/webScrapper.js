// loadind dependencies
import fs           from 'fs'
import puppeteer    from 'puppeteer'

export const webScrapper = {
    /**
     * setUrl
     * Define the url to scrapp into the object
     * @param {string} url url to scrapp 
     */
    setUrl(url) { 
        this.url = url
    },

    /**
     * init
     * initialiaze the webScrapper to the url
     * /!\ THE URL MUST BE DEFINED /!\
     */
    async init() {
        if (this.url === undefined) { return false }

        // set the browser and the page into the object for later access
        this.browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        this.page = await this.browser.newPage()

        await this.page.goto(this.url);
        await this.page.screenshot({ path: "temp/screenshot.png" })
    },

    /**
     * end
     * finish the scrapp session
     */
    async end() {
        await this.browser.close()
        return true
    },

    /**
     * return an array of dom elements
     * @param {string} selector css selector
     * @param {boolean} sub if true the sub brower will be used
     */
    async getElementsArray(selector, sub = false) {
        if (!sub) {
            let elementsArray = (await this.page.$$(selector))
            return elementsArray
        }
        if(this.sub.page !== undefined) {
            let elementsArray = (await this.sub.page.$$(selector))
            return elementsArray
        }

        return false
    },

    /**
     * getElementData
     * return the value of an specified attribute of a specified element for a specified selector
     * @param {Object} element 
     * @param {string} selector 
     * @param {string} attribute 
     */
    async getElementData(element, selector, attribute = 'innerText') {
        var elementData = {}

        switch (attribute) {
            case 'href':
                elementData = await element.$eval(selector, e => e.href)
                break;
        
            case 'innerText':
                elementData = await element.$eval(selector, e => e.innerText)
                break;

            case 'src':
                elementData = await element.$eval(selector, e => e.src)
                break;

            default:
                elementData = await element.$eval(selector, e => e.getAttribute(attribute))
                break;
        }

        return elementData
    },

    /**
     * subScrapping
     * init a sub browser
     * @param {string} url url to scrapp for the sub browser
     */
    async subScrapping(url) {
        this.sub = { browser: await puppeteer.launch({ args: ['--no-sandbox'] }) }
        this.sub.page = await this.sub.browser.newPage()
        await this.sub.page.goto(url)
    },

    /**
     * destroy the sub browser
     */
    async destroySub() { 
        await this.sub.browser.close()
        this.sub = undefined 
    },

    
}

async function getJobsOffers(villes, contrats, pagination, query = '', callback = (result) => {}) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    // construction de l'url à scrapper
    let url = 'https://www.welcometothejungle.co/jobs'
    let urlParam = {
        refinementList: {
            office : { district: villes },
            contract_type_names: { fr: contrats }
        },
        page: pagination.page,
        configure: {
            filters: "website.reference%3Awttj_fr",
            hitsPerPage: pagination.hitsPerPage
        },
        query
    }

    url = url + '?'

    // les villes
    for (let i = 0; i < urlParam.refinementList.office.district.length; i++) {
        if(i >= 1) {
            url = url + '&'
        }
        url = `${url}refinementList[office.district][${i}]=${urlParam.refinementList.office.district[i]}`
    }

    // les types de contrats
    for (let i = 0; i < urlParam.refinementList.contract_type_names.fr.length; i++) {
        url = url + '&'
        url = `${url}refinementList[contract_type_names.fr][${i}]=${urlParam.refinementList.contract_type_names.fr[i]}`
    }

    // la pagination est les filtres supplémentaires
    url = url + '&configure%5Bfilters%5D=' + urlParam.configure.filters
    url = url + '&configure%5BhitsPerPage%5D=' + urlParam.configure.hitsPerPage
    url = url + '&page=' + urlParam.page

    // recherche
    url = url + '&query=' + urlParam.query

    // console.log(url)

    await page.goto(url);
    await page.screenshot({ path: "data/screenshot.png" })

    let html = (await page.$$('.ais-Hits-item'))
    var offres = [];

    for (let i=0; i < html.length; i++) {
        let poste = await html[i].$eval('h3 .ais-Highlight-nonHighlighted', e => e.innerText)
        let entreprise = await html[i].$eval('h4 .ais-Highlight-nonHighlighted', e => e.innerText)
        let logo = await html[i].$eval('img.zphx8j-4', e => e.src)
        let href = await html[i].$eval('a', e => e.href)
        
        let data = await html[0].$$('.sc-bXGyLb')
        let contrat = await data[0].$eval('.sc-cbkKFq span', e => e.innerText)
        let ville = await data[1].$eval('.sc-cbkKFq', e => e.innerText)
        let date = await data[2].$eval('.sc-cbkKFq span', e => e.innerText)
        
        let id = `${entreprise} - ${poste}`

        let offre = { id, poste, entreprise, logo, href, contrat, ville, date }

        offres.push(offre)
    }

    await browser.close();

    if (offres.length === 0) {
        console.log('SCRAPPING FAILED !!')
    } else {
        var result = []
        if (fs.existsSync('data/history.json')) {
            await fs.readFile('data/history.json', (err, data) => {
                if(err) throw err
    
                data = JSON.parse(data.toString())
                offres.forEach((offre) => {
                    let test = data.filter(element => element.id === offre.id)
                    if(test.length === 0) {
                        result.push(offre)
                    }
                });
                fs.writeFile('data/history.json', JSON.stringify(offres), (err) => {
                    if (err) throw err
                    callback(result)
                    console.log(`New scrapping result write (nbr of results: ${result.length})`)
                })
            })
        } else {
            fs.writeFile('data/history.json', JSON.stringify(offres), (err) => {
                if (err) throw err
                result = offres
                callback(result)
                console.log(`New scrapping result write (nbr of results: ${result.length})`)
            })
        }
    }


}