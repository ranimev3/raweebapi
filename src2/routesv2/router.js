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

router.get("/home", scrapeLatest)
router.get("/manhwa-latest", scrapeLatest)
router.get("/manhwa-popular", scrapePopuler)
router.get("/manhwa-new", scrapePopuler)
router.get("/manhwa-only", scrapeOnly)
router.get("/only/:onlyId/page/:pageNumber", scrapeOnly)
router.get("//manhwa-recommendation", scrapeRecomen)
router.get("/manhwa-top", scrapeTop)
router.get("/list", scrapeList)
router.get("/search/:searchId", scrapeSearch)
router.get("/search/:searchId/page/:pageNumber", scrapeSearch)
router.get("/genres", scrapeGenres)
router.get("/genre/:genreId", scrapeGenre)
router.get("/genre/:genreId/page/:pageNumber", scrapeGenre)
router.get("/manhwa-detail/:manhwaId", scrapeDetail)
router.get("/chapter/:chapterId", scrapeChapter)
router.get("/news", scrapeNews)

export default router
