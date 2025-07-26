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
  getList,
  getHomev2,
  getManhwaPopularv2,
  getManhwaRecommendationv2,
  getManhwaNewv2,
  getManhwaTopv2,
  getGenresv2,
  getGenreIdv2,
  getGenreIdPagev2,
  getSearchv2,
  getSearchPagev2,
  getManhwaDetailv2,
  getManhwaOnGoingv2,
  getChapterv2,
  getListv2
} from "../controllers/scrapingController.js";

const router = express.Router();

router.get("/home", getHome);
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
router.get("/komikstation/home", getHomev2);
router.get("/komikstation/manhwa-popular", getManhwaPopularv2);
router.get("/komikstation/manhwa-recommendation", getManhwaRecommendationv2);
router.get("/komikstation/manhwa-new", getManhwaNewv2);
router.get("/komikstation/manhwa-top", getManhwaTopv2);
router.get("/komikstation/genres", getGenresv2);
router.get("/komikstation/genre/:genreId", getGenreIdv2);
router.get("/komikstation/genre/:genreId/page/:pageNumber", getGenreIdPagv2e);
router.get("/komikstation/search/:searchId", getSearchv2);
router.get("/komikstation/search/:searchId/page/:pageNumber", getSearchPagev2);
router.get("/komikstation/manhwa-detail/:manhwaId", getManhwaDetailv2);
router.get("/komikstation/manhwa-ongoing", getManhwaOnGoingv2);
router.get("/komikstation/chapter/:chapterId", getChapterv2); 
router.get("/komikstation/list", getListv2);

export default router;
