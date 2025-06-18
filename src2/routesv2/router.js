import express from "express"

import {
    scrapeLatest,
    scrapePopuler,
    scrapeRecomen,
    scrapeOnly,
    scrapeTop,
    scrapeList,
    scrapeSearch,
    scrapeGenres,
    scrapeGenre,
    scrapeDetail,
    scrapeChapter,
    scrapeNews
} from "../scrappers/scrap.js"

const router = express.Router()

router.get("/latest", scrapeLatest)
router.get("/latest/page/:page", scrapeLatest)
router.get("/populer", scrapePopuler)
router.get("/populer/page/:page", scrapePopuler)
router.get("/only/:type", scrapeOnly)
router.get("/only/:type/page/:page", scrapeOnly)
router.get("/recomen", scrapeRecomen)
router.get("/top", scrapeTop)
router.get("/list", scrapeList)
router.get("/search/:query", scrapeSearch)
router.get("/search/:query/page/:page", scrapeSearch)
router.get("/genres", scrapeGenres)
router.get("/genre/:genre", scrapeGenre)
router.get("/genre/:genre/page/:page", scrapeGenre)
router.get("/detail/:komik", scrapeDetail)
router.get("/chapter/:link", scrapeChapter)
router.get("/news", scrapeNews)

export default router
