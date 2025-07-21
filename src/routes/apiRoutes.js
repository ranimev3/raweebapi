import express from "express";
import {
  getHome,
  scrapeMainPage,
  scrapeOngoingPage,
  scrapeEndpoint,
  scrapeCompletedPage,
  scrapeSeries,
  scrapeGenres,
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
  getList
} from "../controllers/scrapingController.js";

const router = express.Router();

router.get("/home", getHome);
router.get("/anichin/home", scrapeMainPage);
router.get("/anichin/ongoing", scrapeOngoingPage);
router.get("/anichin/episode", scrapeEndpoint);
router.get("/anichin/completed", scrapeCompletedPage);
router.get("/anichin/seri", scrapeSeries);
router.get("/anichin/genres", scrapeGenres);
router.get("/manhwa-popular", getManhwaPopular);
router.get("/manhwa-recommendation", getManhwaRecommendation);
router.get("/manhwa-new", getManhwaNew);
router.get("/manhwa-top", getManhwaTop);
router.get("/genres", getGenres);
router.get("/genre/:genreId", getGenreId);
router.get("/genre/:genreId/page/:pageNumber", getGenreIdPage);
router.get("/search/:searchId", getSearch);
router.get("/search/:searchId/page/:pageNumber", getSearchPage);
router.get("/manhwa-detail/:manhwaId", getManhwaDetail);
router.get("/manhwa-ongoing", getManhwaOnGoing);
router.get("/chapter/:chapterId", getChapter); 
router.get("/list", getList); 

export default router;
