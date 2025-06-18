import { load } from "cheerio"
import { fetchPage } from "../controllers/service.js"

export const scrapeLatest = async (req, res) => {
    try {
        const page = req.params.page || "1"
        const url = `https://bacakomik.one/komik-terbaru/page/${page}`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".animepost").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const chapter = $(element).find(".lsch a").text().trim().replace(/\s/g,"")
            const date = $(element).find(".datech").text().trim()
            const type = $(element).find("span.typeflag.Manhwa")
                  ? "manhwa"
                  : $(element).find("span.typeflag.Manhua")
                  ? "manhua"
                  : "manga"

            komikList.push({ title,link,cover,chapter,date,type })
        })
        
        const nextPage = $("a.next.page-numbers").length > 0
        
        res.json({ komikList,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeSearch = async (req, res) => {
    try {
        const page = req.params.page || "1"
        const query = req.params.query
        const url = `https://bacakomik.one/page/${page}/?s=${query}`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".animepost").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("src")
            const rating = $(element).find(".rating i").text().trim()
            const type = $(element).find("span.typeflag.Manhwa")
                  ? "manhwa"
                  : $(element).find("span.typeflag.Manhua")
                  ? "manhua"
                  : "manga"

            komikList.push({ title,link,cover,rating,type })
        })
        
        const nextPage = $("a.next.page-numbers").length > 0
        
        res.json({ komikList,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeDetail = async (req, res) => {
    try {
        const komik = req.params.komik
        const url = `https://bacakomik.one/komik/${komik}`
        const html = await fetchPage(url)
        const $ = load(html)

        const title = $(".postbody h1").text().replace("Komik","").trim()
        const cover = $(".postbody img").attr("data-lazy-src")
        const firstChapter = {
            title: $(".postbody .epsbr").eq(0).find("span.barunew").text().replace("Chapter","").replace(/\s/g,""),
            link: $(".postbody .epsbr").eq(0).find("a").attr("href"),
        }
        const lastChapter = {
            title: $(".postbody .epsbr").eq(1).find("span.barunew").text().replace("Chapter","").replace(/\s/g,""),
            link: $(".postbody .epsbr").eq(1).find("a").attr("href"),
        }
        const rating = $(".postbody .rtg").text().replace(/\s/g,"")
        const otherTitle = $(".infox .spe span").eq(0).text().split(":")[1].trim()
        const status = $(".infox .spe span").eq(1).text().split(":")[1].trim()
        const type = $(".infox .spe span").eq(2).text().split(":")[1].trim()
        const author = $(".infox .spe span").eq(3).text().split(":")[1].trim()
        const artist = $(".infox .spe span").eq(4).text().split(":")[1].trim()
        const release = $(".infox .spe span").eq(5).text().split(":")[1].trim()
        const series = $(".infox .spe span").eq(6).text().split(":")[1].trim()
        const reader = $(".infox .spe span").eq(7).text().split(":")[1].trim()
        const synopsis = $(".postbody [itemprop='description']").text().replace(/\s+/g," ").trim()
        
        const genres = []
        $(".postbody .genre-info a").each((index, element) => {
            const genreTitle = $(element).text().trim()
            const genreLink = $(element).attr("href")
            genres.push({title: genreTitle,link: genreLink })
        })
        
        const chapters = []
        $(".postbody #chapter_list li").each((index, element) => {
            const chapterTitle = $(element).find("span.lchx chapter").text().replace(/\n/g, " ").trim()
            const chapterLink = $(element).find("span.lchx a").attr("href")
            const chapterDate = $(element).find("span.dt").text().trim()
            chapters.push({title: chapterTitle,link: chapterLink,date: chapterDate })
        })
        
        res.json({ title,cover,firstChapter,lastChapter,rating,otherTitle,status,type,author,artist,release,reader,synopsis,genres,chapters })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeChapter = async (req, res) => {
    try {
        const link = req.params.link
        const url = `https://bacakomik.one/${link}`
        const html = await fetchPage(url)
        const $ = load(html)

        const title = $(".dtlx h1").text().replace("Komik","").replace(/\s+/g, " ").trim()
        const images = []
        $("#anjay_ini_id_kh img").each((index, element) => {
            images.push($(element).attr("data-lazy-src"))
        })
        const nextPage = $(".nextprev a[rel='next']").length > 0
        
        res.json({ title,images,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeGenres = async (req, res) => {
    try {
        const url = "https://bacakomik.one/daftar-genre/"
        const html = await fetchPage(url)
        const $ = load(html)

        const genres = []
        $("ul.genrelist li").each((index, element) => {
            const genreTitle = $(element).text().trim()
            const genreLink = $(element).find("a").attr("href")
            genres.push({title: genreTitle,link: genreLink })
        })
        
        res.json( genres )
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeGenre = async (req, res) => {
    try {
        const page = req.params.page || "1"
        const genre = req.params.genre
        const url = `https://bacakomik.one/genres/${genre}/page/${page}`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".animepost").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const rating = $(element).find(".rating i").text().trim()
            const type = $(element).find("span.typeflag.Manhwa")
                  ? "manhwa"
                  : $(element).find("span.typeflag.Manhua")
                  ? "manhua"
                  : "manga"

            komikList.push({ title,link,cover,rating,type })
        })
        
        const nextPage = $("a.next.page-numbers").length > 0
        
        res.json({ komikList,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapePopuler = async (req, res) => {
    try {
        const page = req.params.page || "1"
        const url = `https://bacakomik.one/komik-populer/page/${page}`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".animepost").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const rating = $(element).find(".rating i").text().trim()
            const type = $(element).find("span.typeflag.Manhwa")
                  ? "manhwa"
                  : $(element).find("span.typeflag.Manhua")
                  ? "manhua"
                  : "manga"

            komikList.push({ title,link,cover,rating,type })
        })
        
        const nextPage = $("a.next.page-numbers").length > 0
        
        res.json({ komikList,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeOnly = async (req, res) => {
    try {
        const type = req.params.type
        const page = req.params.page || "1"
        const url = `https://bacakomik.one/baca-${type}/page/${page}`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".animepost").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const chapter = $(element).find(".lsch a").text().trim().replace(/\s/g,"")
            const date = $(element).find(".datech").text().trim()
            const type = $(element).find("span.typeflag.Manhwa")
                  ? "manhwa"
                  : $(element).find("span.typeflag.Manhua")
                  ? "manhua"
                  : "manga"

            komikList.push({ title,link,cover,chapter,date,type })
        })
        
        const nextPage = $("a.next.page-numbers").length > 0
        
        res.json({ komikList,nextPage })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeRecomen = async (req, res) => {
    try {
        const url = `https://bacakomik.one/genres/action/`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".serieslist li").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const rating = $(element).find("span.loveviews").text().trim()
            const genre = $(element).find("span.genre").text().trim()

            komikList.push({ title,link,cover,rating,genre })
        })
        
        res.json( komikList )
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeTop = async (req, res) => {
    try {
        const url = `https://bacakomik.one/komik-populer/`
        const html = await fetchPage(url)
        const $ = load(html)

        const komikList = []
        $(".serieslist.pop li").each((index, element) => {
            const title = $(element).find("h4").text().trim()
            const link = $(element).find("a").attr("href")
            const cover = $(element).find("img").attr("data-lazy-src")
            const rating = $(element).find("span.loveviews").text().trim()
            
            komikList.push({ title,link,cover,rating })
        })
        
        res.json( komikList )
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeList = async (req, res) => {
    try {
        const url = `https://bacakomik.one/daftar-komik/?list`
        const html = await fetchPage(url)
        const $ = load(html)

        const author = []
        $(".dropdown-menu.c4").eq(0).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            author.push({ title,link })
        })
        
        const artist = []
        $(".dropdown-menu.c4").eq(1).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            artist.push({ title,link })
        })
        
        const genres = []
        $(".dropdown-menu.c4").eq(2).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            genres.push({ title,link })
        })
        
        const release = []
        $(".dropdown-menu.c4").eq(3).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            release.push({ title,link })
        })
        
        const status = []
        $(".dropdown-menu.c1").eq(0).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            status.push({ title,link })
        })
        
        const type = []
        $(".dropdown-menu.c1").eq(1).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            type.push({ title,link })
        })
        
        const orderby = []
        $(".dropdown-menu.c1").eq(3).find("li").each((index, element) => {
            const title = $(element).text().trim()
            const link = $(element).find("input").attr("value")
            orderby.push({ title,link })
        })
        
        res.json({ author,artist,genres,release,status,type,orderby })
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
}

export const scrapeNews = async (req, res) => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/Fall-Xavier/Fall-Xavier/refs/heads/main/news.json");
        const jsonData = await response.json()
        
        textData = []
        jsonData.forEach(item => {
            textData.push({title: item.title, description: item.description })
        })
        
        res.json( textData )
    } catch (error) {
        console.error("Scraping Error:", error)
        res.status(500).json({ error: error.message })
    }
              }
