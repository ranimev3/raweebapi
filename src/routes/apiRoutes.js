import express from "express";
import {
  getHome,
  getManhwaPopular,
  getManhwaRecommendation,
  getManhwaNew,
  getManhwaTop,
  getGenres,
  getGenreId,
  getGenreIdPage,
  getSearch,
  getSearchPage,
  getManhwaDetail,
  getManhwaOnGoing,
  getChapter,
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
  scrapeNews,
  getList
} from "../controllers/scrapingController.js";

const router = express.Router();

router.get("/home", getHome);
router.get("/manhwa-popular", getManhwaPopular);
router.get("/manhwa-recommendation", getManhwaRecommendation);
router.get("/manhwa-new", getManhwaNew);
router.get("/manhwa-top", getManhwaTop);
router.get("/bacakomik/chapter/:chapterId", scrapeChapter);
router.get("/genres", getGenres);
router.get("/genre/:genreId", getGenreId);
router.get("/genre/:genreId/page/:pageNumber", getGenreIdPage);
router.get("/search/:searchId", getSearch);
router.get("/search/:searchId/page/:pageNumber", getSearchPage);
router.get("/manhwa-detail/:manhwaId", getManhwaDetail);
router.get("/manhwa-ongoing", getManhwaOnGoing);
router.get("/chapter/:chapterId", getChapter); 
router.get("/listv2", getListv2);
router.get("/list", getList);

export default router;
