// Subscribe my channel
import { load } from "cheerio";
import { fetchPage } from "../utils/fetchPage.js";
import { fetchdonghua } from "../utils/fetchdonghua.js";

export const getHome = async (req, res) => {
  try {
    const url = "https://mangakita.id/";
    const html = await fetchPage(url);
    const $ = load(html);

    const latestUpdates = [];
    $(".utao").each((index, element) => {
      const title = $(element).find(".luf h3").text().trim();
      const link = $(element).find(".luf a.series").attr("href");
      const imageSrc = $(element).find(".imgu img").attr("src");
      const chapters = [];

      $(element)
        .find(".luf ul li").each((i, el) => {
          const chapterLink = $(el).find("a").attr("href");
          const chapterTitle = $(el).find("a").text().trim();
          const timeAgo = $(el).find("span").text().trim();

          chapters.push({
            chapterLink,
            chapterTitle,
            timeAgo,
          });
        });

      latestUpdates.push({
        title,
        link,
        imageSrc,
        chapters,
      });
    });

    const popularManhwa = [];
    $(".serieslist.pop.wpop ul li").each((index, element) => {
      const title = $(element).find(".leftseries h2 a").text().trim();
      const link = $(element).find(".leftseries h2 a").attr("href");
      const imageSrc = $(element).find(".imgseries img").attr("src");
      const rating = $(element).find(".numscore").text().trim();
      const genres = [];

      $(element)
        .find(".leftseries span a").each((i, el) => {
          genres.push($(el).text().trim());
        });

      if (!popularManhwa.some((manhwa) => manhwa.title === title)) {
        popularManhwa.push({
          title,
          link,
          imageSrc,
          rating,
          genres,
        });
      }
    });

    const trending = [];
    $(".listupd.popularslider .bs").each((index, element) => {
      const title = $(element).find(".bsx .bigor .tt").text().trim();
      const link = $(element).find(".bsx a").attr("href");
      const imageSrc = $(element).find(".bsx img").attr("src");
      const rating = $(element).find(".numscore").text().trim();
      const latestChapter = $(element).find(".epxs").text().trim();

      if (
        !trending.some((item) => item.title === title && item.link === link)
      ) {
        trending.push({
          title,
          link,
          imageSrc,
          rating,
          latestChapter,
        });
      }


    });

    const genres = [];
    $(".genre li a").each((index, element) => {
      const genreTitle = $(element).text().trim();
      const genreLink = $(element).attr("href");
      genres.push({ title: genreTitle, link: genreLink });
    });

    res.json({ trending, latestUpdates, popularManhwa, genres });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaPopular = async (req, res) => {
  try {
    const url = "https://mangakita.id/manga/?status=&type=manga&order=popular";

    const html = await fetchPage(url);

    const $ = load(html);

    const results = [];

    $(".bs").each((index, element) => {
      const title = $(element).find(".tt").text().trim();
      const chapter = $(element).find(".epxs").text().trim();
      const rating = $(element).find(".numscore").text().trim();
      const imageSrc = $(element).find("img").attr("src");
      const link = $(element).find("a").attr("href");

      results.push({
        title,
        chapter,
        rating,
        imageSrc,
        link,
      });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaRecommendation = async (req, res) => {
  try {
    const urls = [
      "https://mangakita.id/manga/?page=1&type=manhwa&order=popular",
      "https://mangakita.id/manga/?page=1&type=manga&order=popular",
      "https://mangakita.id/manga/?page=1&type=manhua&order=popular",
      "https://mangakita.id/manga/?status=&type=novel&order=update",
    ];

    const allResults = [];

    for (const url of urls) {
      const html = await fetchPage(url);

      const $ = load(html);

      $(".bs").each((index, element) => {
        const title = $(element).find(".tt").text().trim();
        const chapter = $(element).find(".epxs").text().trim();
        const rating = $(element).find(".numscore").text().trim();
        const imageSrc = $(element).find("img").attr("src");
        const link = $(element).find("a").attr("href");

        allResults.push({
          title,
          chapter,
          rating,
          imageSrc,
          link,
        });
      });
    }

    res.json(allResults);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaNew = async (req, res) => {
  try {
    const url = "https://mangakita.id/";
    const html = await fetchPage(url);
    const $ = load(html);

    const results = [];

    $(".utao").each((index, element) => {
      const title = $(element).find(".luf h4").text().trim();
      const link = $(element).find(".luf a.series").attr("href");
      const imageSrc = $(element).find("img").attr("src");
      const chapters = [];

      const mangaList = $(element).find(".luf ul.Manga li");
      const manhwaList = $(element).find(".luf ul.Manhwa li");
      const manhuaList = $(element).find(".luf ul.Manhua li");
      const chapterElements = mangaList.length
        ? mangaList
        : manhwaList.length
        ? manhwaList
        : manhuaList;

      chapterElements.each((i, el) => {
        const chapterLink = $(el).find("a").attr("href");
        const chapterTitle = $(el).find("a").text().trim();
        const timeAgo = $(el).find("span").text().trim();

        chapters.push({
          chapterLink,
          chapterTitle,
          timeAgo,
        });
      });

      results.push({
        title,
        link,
        imageSrc,
        chapters,
      });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaTop = async (req, res) => {
  const url = "https://mangakita.id/";

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const recommendations = [];

    $(".serieslist.pop.wpop.wpop-weekly ul li").each((index, element) => {
      const item = {};
      const img = $(element).find(".imgseries img");

      item.rank = $(element).find(".ctr").text().trim();
      item.title = $(element).find(".leftseries h2 a").text().trim();
      item.url = $(element).find(".leftseries h2 a").attr("href");
      item.image = img.attr("src").split("?")[0];
      item.genres = $(element)
        .find(".leftseries span")
        .text()
        .replace("Genres: ", "")
        .split(", ");
      item.rating = $(element).find(".numscore").text().trim();

      recommendations.push(item);
    });

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getGenres = async (req, res) => {
  try {
    const url = "https://mangakita.id/manga/list-mode/";
    const html = await fetchPage(url);
    const $ = load(html);

    const genres = [];

    $(".dropdown-menu.c4.genrez li").each((index, element) => {
      const genreLabel = $(element).find("label").text().trim();
      const genreValue = $(element).find("input").val();

      if (genreLabel && genreValue) {
        genres.push({ label: genreLabel, value: genreValue });
      }
    });

    res.json({ genres });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getGenreId = async (req, res) => {
  const { genreId } = req.params;
  const url = `https://mangakita.id/genres/${genreId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageUrl = $(element).attr("href");
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $(".pagination a.next.page-numbers").attr("href");

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getGenreIdPage = async (req, res) => {
  const { genreId, pageNumber } = req.params;
  const url = `https://mangakita.id/genres/${genreId}/page/${pageNumber}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();

      if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
        const pageUrl = $(element).attr("href");
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getSearch = async (req, res) => {
  const { searchId } = req.params;
  const url = `https://mangakita.id/?s=${searchId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageUrl = $(element).attr("href");
      const pageNumber = $(element).text();
      pagination.push({ pageUrl, pageNumber });
    });

    const nextPage = $(".pagination a.next.page-numbers").attr("href");

    res.json({ seriesList, pagination, nextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getSearchPage = async (req, res) => {
  const { searchId, pageNumber } = req.params;
  const url = `https://mangakita.id/page/${pageNumber}/?s=${searchId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);
    const seriesList = [];

    $(".bs").each((index, element) => {
      const series = {};
      const bsx = $(element).find(".bsx");

      series.title = bsx.find("a").attr("title");
      series.url = bsx.find("a").attr("href");
      series.image = bsx.find("img").attr("src");
      series.latestChapter = bsx.find(".epxs").text();
      series.rating = bsx.find(".numscore").text();

      seriesList.push(series);
    });

    const pagination = [];
    $(".pagination a.page-numbers").each((index, element) => {
      const pageText = $(element).text().trim().toLowerCase();

      if (pageText !== "« sebelumnya" && pageText !== "berikutnya »") {
        const pageUrl = $(element).attr("href");
        const pageNumber = $(element).text();
        pagination.push({ pageUrl, pageNumber });
      }
    });

    res.json({ seriesList, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const getManhwaDetail = async (req, res) => {
  const manhwaId = req.params.manhwaId;
  const url = `https://mangakita.id/manga/${manhwaId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const title = $(".entry-title").text().trim();
    const alternative = $(".wd-full span").text().trim();
    const imageSrc = $(".thumb img").attr("src");
    const rating = $(".rating .num").text().trim();
    const followedBy = $(".bmc").text().trim();

    const synopsis = $(".entry-content.entry-content-single").text().trim();

    const firstChapterLink = $(".lastend .inepcx")
      .first()
      .find("a")
      .attr("href");
    const firstChapterTitle = $(".lastend .inepcx")
      .first()
      .find(".epcurfirst")
      .text()
      .trim();
    const latestChapterLink = $(".lastend .inepcx")
      .last()
      .find("a")
      .attr("href");
    const latestChapterTitle = $(".lastend .inepcx")
      .last()
      .find(".epcurlast")
      .text()
      .trim();

    const status = $('.imptdt').eq().find('i').text().trim();
    const type = $('.imptdt').eq().find('a').text().trim();
    const released = $('.imptdt').eq(2).find('a').text().trim();
    const author = $('.imptdt').eq(1).find('i').text().trim();
    const artist = $('.imptdt').eq(2).find('i').text().trim();
    const updatedOn = $('.imptdt').eq(3).find('time').text().trim();
    
    const genres = [];
    $(".mgen a").each((index, element) => {
      const genreName = $(element).text().trim();
      const genreLink = $(element).attr("href");
      genres.push({
        genreName,
        genreLink,
      });
    });

    const chapters = [];
    $("#chapterlist li").each((index, element) => {
      const chapterNum = $(element).find(".chapternum").text().trim();
      const chapterLink = $(element).find(".eph-num a").attr("href");
      const chapterDate = $(element).find(".chapterdate").text().trim();
      const downloadLink = $(element).find(".dload").attr("href");

      chapters.push({
        chapterNum,
        chapterLink,
        chapterDate,
        downloadLink,
      });
    });

    const manhwaDetails = {
      title,
      alternative,
      imageSrc,
      rating,
      followedBy,
      synopsis,
      firstChapter: {
        title: firstChapterTitle,
        link: firstChapterLink,
      },
      latestChapter: {
        title: latestChapterTitle,
        link: latestChapterLink,
      },
      status,
      type,
      released,
      author,
      artist,
      updatedOn,
      genres,
      chapters,
    };

    res.json(manhwaDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping data");
  }
};

export const getManhwaOnGoing = async (req, res) => {
  const url =
    "https://mangakita.id/manga/?status=ongoing&type=manhwa&order=";
  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const manhwaList = [];

    $(".bs").each((index, element) => {
      const title = $(element).find(".bigor .tt").text().trim();
      const imageUrl = $(element).find("img").attr("src");
      const link = $(element).find("a").attr("href");
      const latestChapter = $(element).find(".epxs").text().trim();
      const rating = $(element).find(".numscore").text().trim();

      manhwaList.push({
        title,
        imageUrl,
        link,
        latestChapter,
        rating,
      });
    });

    res.send(manhwaList);
  } catch (error) {
    res.status(500).send({
      message: "Gagal mengambil data manhwa ongoing.",
      error: error.message,
    });
  }
};

export const getChapter = async (req, res) => {
  const { chapterId } = req.params;
  const url = `https://mangakita.id/${chapterId}`;

  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const title = $("h1.entry-title").text().trim();
    const manhwaLink = $(".ts-breadcrumb ol li").eq(1).find("a").attr("href");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await delay(250);

    const scriptContent = $("script")
      .filter((i, el) => {
        return $(el).html().includes("ts_reader.run");
      })
      .html();

    const jsonString = scriptContent.match(/ts_reader\.run\((.*?)\);/)[1];
    const jsonObject = JSON.parse(jsonString);

    const images = jsonObject.sources[0].images;

    const prevChapter = jsonObject.prevUrl || null;
    const nextChapter = jsonObject.nextUrl || null;

    const chapters = [];
    $(".nvx #chapter option").each((index, element) => {
      const chapterTitle = $(element).text().trim();
      const chapterUrl = $(element).attr("value") || null;

      chapters.push({
        title: chapterTitle,
        url: chapterUrl,
      });
    });

    const prevButtonUrl = $(".ch-prev-btn").attr("href") || null;
    const nextButtonUrl = $(".ch-next-btn").attr("href") || null;

    res.json({
      title,
      manhwaLink,
      images,
      prevChapter,
      nextChapter,
      chapters,
      prevButtonUrl,
      nextButtonUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chapter data" });
  }
};

export const getList = async (req, res) => {
  const url = "https://mangakita.id/manga/list-mode/";

  try {
    const html = await fetchPage(url);
    const $ = load(html);

    const manhwaLists = [];

    $(".blix").each((index, element) => {
      const name = $(element).find("> span > a").text().trim();
      const manhwaList = [];

      $(element)
        .find("> ul > li")
        .each((i, el) => {
          const title = $(el).find("a.series").text().trim();
          const href = $(el).find("a.series").attr("href");
          manhwaList.push({ title, href });
        });

      manhwaLists.push({ name, manhwaList });
    });

    res.json(manhwaLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

//anichin
async function scrapeMainPage() {
  try {
    const { data } = await axios.get('https://anichin.cafe/');
    const $ = cheerio.load(data);

    const results = [];

    $('find it at https://anichin.live/ :b').each((index, element) => {
      const title = $(element).find('h2[itemprop="headline"]').text().trim();
      const href = $(element).attr('href').replace('https://anichin.live', '/episode');

      const imgSrc = $(element).find('div.limit > img').attr('src');

      results.push({ title, href: href, image: imgSrc });
    });

    return results;
  } catch (error) {
    console.error('Error scraping the main page:', error);
    return [];
  }
}

async function scrapeOngoingPage() {
  try {
      const url = 'https://anichin.live/schedule/';
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const senin = [];
      const selasa = [];
      const rabu = [];
      const kamis = [];
      const jumat = [];
      const sabtu = [];
      const minggu = [];

      // senin
      $('find it at https://anichin.live/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        senin.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });
    
      // selasa
      $('find it at https://anichin.live/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        selasa.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });
    
      // rabu
      $('find it at https://anichin.live/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        rabu.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });

      // kamis
      $('find it at https://anichin.live/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        kamis.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });

      // jumat
      $('find it at https://anichin.cafe/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        jumat.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });

      // sabtu
      $('find it at https://anichin.live/ :b').each((index, element) => {
          const seriesElement = $(element).find('div.bsx');
          
          // Extract the series details
          const title = seriesElement.find('a').attr('title').trim();
          const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
          const imageSrc = seriesElement.find('img').attr('src');
          const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
          const releaseTime = seriesElement.find('span.epx').text().trim();

          // Push the extracted series details to the ongoingSeries array
          
          sabtu.push({
              title,
              seriesLink,
              imageSrc,
              episodeCount,
              releaseTime
          });
      });
      
      // minggu
      $('find it at https://anichin.cafe/ :b').each((index, element) => {
        const seriesElement = $(element).find('div.bsx');
        
        // Extract the series details
        const title = seriesElement.find('a').attr('title').trim();
        const seriesLink = seriesElement.find('a').attr('href').replace('https://anichin.live', '');
        const imageSrc = seriesElement.find('img').attr('src');
        const episodeCount = seriesElement.find('span.sb.Sub').text().trim();
        const releaseTime = seriesElement.find('span.epx').text().trim();

        // Push the extracted series details to the ongoingSeries array
        
        minggu.push({
            title,
            seriesLink,
            imageSrc,
            episodeCount,
            releaseTime
        });
      });

      return {
        senin: senin,
        selasa : selasa,
        rabu: rabu,
        kamis: kamis,
        jumat: jumat,
        sabtu: sabtu,
        minggu: minggu
      }
  } catch (error) {
      console.error('Error scraping ongoing series:', error);
      return { error: 'Failed to retrieve ongoing series' };
  }
}

// Function to scrape a specific episode
async function scrapeEndpoint(endpoint) {
  try {
    const url = `https://anichin.cafe${endpoint}`;
    console.log('Scraping URL:', url); // Debug log

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('find it at https://anichin.live/ :b').text().trim();
    const iframeSrc = $('find it at https://anichin.live/ :b').attr('src');

    const singleInfo = $('find it at https://anichin.live/ :b');

    const mainImage = singleInfo.find('div.thumb > img').attr('src');
    const mainTitle = singleInfo.find('div.infox > div.infolimit > h2[itemprop="partOfSeries"]').text().trim();
    const alternativeTitle = singleInfo.find('div.infox > div.infolimit > span.alter').text().trim();
    const rating = singleInfo.find('div.infox > div.rating > strong').text().replace('Rating', '').trim();
    
    const infoContent = singleInfo.find('div.infox > div.info-content > div.spe');
    const status = infoContent.find('span:contains("Status:")').text().replace('Status:', '').trim();
    const network = infoContent.find('span:contains("Network:") > a').text().trim();
    const studio = infoContent.find('span:contains("Studio:") > a').text().trim();
    const released = infoContent.find('span:contains("Released:")').text().replace('Released:', '').trim();
    const duration = infoContent.find('span:contains("Duration:")').text().replace('Duration:', '').trim();
    const season = infoContent.find('span:contains("Season:") > a').text().trim();
    const country = infoContent.find('span:contains("Country:") > a').text().trim();
    const type = infoContent.find('span:contains("Type:")').text().replace('Type:', '').trim();
    const episodes = infoContent.find('span:contains("Episodes:")').text().replace('Episodes:', '').trim();
    const fansub = infoContent.find('span:contains("Fansub:")').text().replace('Fansub:', '').trim();

    const genres = singleInfo.find('div.infox > div.info-content > div.genxed > a').map((i, el) => $(el).text().trim()).get();
    const description = singleInfo.find('div.infox > div.info-content > div.desc').text().trim();

    const episodeList = [];
    $('find it at https://anichin.live/ :b').each((index, element) => {
      const episodeHref = $(element).find('a').attr('href').replace('https://anichin.live', '/episode');
      const thumbnelSrc = $(element).find('div.thumbnel > img').attr('src');
      const episodeTitle = $(element).find('div.playinfo > h4').text().trim();
      const episodeDetails = $(element).find('div.playinfo > span').text().trim();

      episodeList.push({
        href: episodeHref,
        thumbnail: thumbnelSrc,
        title: episodeTitle,
        details: episodeDetails
      });
    });

    return {
      title,
      video_link: iframeSrc,
      details: {
        mainImage,
        mainTitle,
        alternativeTitle,
        rating,
        status,
        network,
        studio,
        released,
        duration,
        season,
        country,
        type,
        episodesCount: episodes,
        fansub,
        genres,
        description
      },
      episodes: episodeList

    };
  } catch (error) {
    console.error(`Error scraping the endpoint ${endpoint}:`, error);
    return { title: 'Error', releasedOn: 'Error', video: 'Error', episodes: [], details: {} };
  }
}

// list all completed series
async function scrapeCompletedPage(page = 1) {
  try {
    const url = page === 1 ? 'https://anichin.cafe/completed/' : `https://anichin.cafe/completed/page/${page}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    // Adjust the selectors based on the provided structure
    $('find it at https://anichin.live/ :b').each((index, element) => {
      const title = $(element).find('div.bsx a.tip > div.tt h2[itemprop="headline"]').text().trim();
      const href = $(element).find('div.bsx a.tip').attr('href');
      const path = new URL(href, 'https://anichin.cafe').pathname;
      const imgSrc = $(element).find('div.bsx a.tip > div.limit > img').attr('src');
      const type = $(element).find('div.limit > div.typez').text().trim();

      results.push({ title, href: path, image: imgSrc, type });
    });

    return results;
  } catch (error) {
    console.error('Error scraping the completed page:', error);
    return [];
  }
}



// scrape series
async function scrapeSeries(endpoint) {
    try {
        const url = `https://anichin.cafe/seri/${endpoint}`;
        console.log('Scraping Series URL:', url); 

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const bigContent = $('find it at https://anichin.cafe/ :b');

        const mainImage = bigContent.find('div.thumbook > div.thumb > img').attr('src');
        const rating = bigContent.find('div.rt > div.rating > strong').text().replace('Rating ', '').trim();
        const followed = bigContent.find('div.rt > div.bmc').text().replace('Followed ', '').trim();
        const mainTitle = bigContent.find('div.infox > h1.entry-title').text().trim();
        const alternativeTitle = bigContent.find('div.infox > div.ninfo > span.alter').text().trim();
        const shortDescription = bigContent.find('div.infox > div.ninfo > div.mindesc').text().trim();

        const infoContent = bigContent.find('div.infox > div.ninfo > div.info-content > div.spe');
        const status = infoContent.find('span:contains("Status:")').text().replace('Status:', '').trim();
        const network = infoContent.find('span:contains("Network:") > a').text().trim();
        const studio = infoContent.find('span:contains("Studio:") > a').text().trim();
        const released = infoContent.find('span:contains("Released:")').text().replace('Released:', '').trim();
        const duration = infoContent.find('span:contains("Duration:")').text().replace('Duration:', '').trim();
        const season = infoContent.find('span:contains("Season:") > a').text().trim();
        const country = infoContent.find('span:contains("Country:") > a').text().trim();
        const type = infoContent.find('span:contains("Type:")').text().replace('Type:', '').trim();
        const episodes = infoContent.find('span:contains("Episodes:")').text().replace('Episodes:', '').trim();
        const fansub = infoContent.find('span:contains("Fansub:")').text().replace('Fansub:', '').trim();
        const releasedOn = infoContent.find('span:contains("Released on:") > time').text().trim();
        const updatedOn = infoContent.find('span:contains("Updated on:") > time').text().trim();

        const genres = bigContent.find('div.infox > div.ninfo > div.info-content > div.genxed > a').map((i, el) => $(el).text().trim()).get();
        const description = bigContent.find('div.infox > div.ninfo > div.info-content > div.desc').text().trim();

        const episodeList = [];
        $('find it at https://anichin.live/ :b').each((i, el) => {
            const episodeNumber = $(el).find('div.epl-num').text().trim();
            const episodeTitle = $(el).find('div.epl-title').text().trim();
            const episodeLink = $(el).find('a').attr('href').replace('https://anichin.live', '/episode'); // Remove base URL
            const episodeDate = $(el).find('div.epl-date').text().trim();
            const subtitleStatus = $(el).find('div.epl-sub > span').text().trim();

            episodeList.push({
                episodeNumber,
                episodeTitle,
                episodeLink, 
                episodeDate,
                subtitleStatus
            });
        });

        return {
            details: [{
                mainImage,
                mainTitle,
                alternativeTitle,
                shortDescription,
                rating,
                followed,
                status,
                network,
                studio,
                released,
                duration,
                season,
                country,
                type,
                episodes,
                fansub,
                releasedOn,
                updatedOn,
                genres,
                description,
            }],
            episode_list: episodeList
        };
    } catch (error) {
        console.error(`Error scraping the series endpoint ${endpoint}:`, error);
        return { error: 'Failed to retrieve series details' };
    }
}

async function scrapeGenres(genreName) {
  try {
    const url = `https://anichin.cafe/genres/${genreName}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results = [];

    $('find it at https://anichin.cafe/ :b').each((index, element) => {
      const title = $(element).find('div.bsx > a.tip > div.tt > h2[itemprop="headline"]').text().trim();
      const href = $(element).find('div.bsx > a.tip').attr('href').replace('https://anichin.live', '');
      const imgSrc = $(element).find('div.bsx > a.tip > div.limit > img').attr('src');
      const type = $(element).find('div.bsx > a.tip > div.limit > div.typez').text().trim();

      results.push({ title, href, image: imgSrc, type });
    });

    return results;
  } catch (error) {
    console.error('Error scraping genres:', error);
    return [];
  }
        }
