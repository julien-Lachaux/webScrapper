import { webScrapper } from './webScrapper'

let getSupremeArticles = async function() {
    console.log('init scrapping')
    webScrapper.setUrl('https://www.supremenewyork.com/shop/all')
    await webScrapper.init()
    let supremeArticles = await webScrapper.getElementsArray('#container article')

    let result = []
    for (let i=0; i < 6; i++) {
        console.log(`article ${i} on ${supremeArticles.length}`)
        let articleUrl = await supremeArticles[i].$eval('.inner-article a', e => e.href)
        let articleImg = await supremeArticles[i].$eval('.inner-article img', e => e.src)

        await webScrapper.subScrapping(articleUrl)
        let articleDetail = (await webScrapper.getElementsArray('#container', true))[0]

        let articleName = await articleDetail.$eval('h1.protect', e => e.innerText)
        let articleModel = await articleDetail.$eval('p[itemprop="model"]', e => e.innerText)
        let articleDescription = await articleDetail.$eval('p[itemprop="description"]', e => e.innerText)
        let articlePriceBrut = await articleDetail.$eval('p[itemprop="offers"] span', e => e.innerText)
        let articlePrice = articlePriceBrut.substring(1)
        let articlePriceUnit = articlePriceBrut.substring(0, 1)
        
        let articlesSizes = (await webScrapper.sub.page.evaluate(() => {
            let sizes = []
            let sizesDomArray = document.querySelectorAll('#size option')
            if (sizesDomArray.length !== 0) {
                sizesDomArray.forEach(option => {
                    console.log(option)
                    sizes.push(option.innerText)
                })
            }

            return sizes
        }))
        console.log(articlesSizes)

        if(articlesSizes.length === 0) {
            articlesSizes.push('Unique')
        }

        webScrapper.destroySub()

        let article = {
            name: articleName,
            model: articleModel,
            description: articleDescription,
            url: articleUrl,
            img: articleImg,
            price: articlePrice,
            priceUnit: articlePriceUnit,
            sizes : articlesSizes
        }
        result.push(article)

        article = {}
    }
    // console.log(result)
    await webScrapper.end()
}

getSupremeArticles()