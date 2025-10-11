// Subscribe my channel
import { load } from "cheerio";
import { fetchPage } from "../utils/fetchPage.js";
import { Fetchpage } from "../utils/Fetchpage.js";

export const getHome = async (req, res) => {
  try {
    const url = "https://kiryuu02.com/";
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
    const url = "https://kiryuu02.com/manga/?status=&type=manhwa&order=popular";

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
      "https://kiryuu02.com/manga/?page=1&type=manhwa&order=popular",
      "https://kiryuu02.com/manga/?page=1&type=manga&order=popular",
      "https://kiryuu02.com/manga/?page=1&type=manhua&order=popular",
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
    const url = "https://kiryuu02.com/";
    const html = await fetchPage(url);
    const $ = load(html);

    const results = [];

    $(".utao").each((index, element) => {
      const title = $(element).find(".luf h4").text().trim();
      const link = $(element).find(".luf a.series").attr("href");
      const imageSrc = $(element).find(".imgu img").attr("src");
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
  const url = "https://kiryuu02.com/";

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
    const url = "https://kiryuu02.com/manga/list-mode/";
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
  const url = `https://kiryuu02.com/genres/${genreId}`;

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
  const url = `https://kiryuu02.com/genres/${genreId}/page/${pageNumber}`;

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
  const url = `https://kiryuu02.com/?s=${searchId}`;

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
  const url = `https://kiryuu02.com/page/${pageNumber}/?s=${searchId}`;

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
  const url = `https://kiryuu02.com/manga/${manhwaId}`;

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

    const status = $("table.infotable tr").eq(0).find('td').eq(1).text().trim();
    const type = $("table.infotable tr").eq(1).find('td').eq(1).text().trim();
    const released = $("table.infotable tr").eq(2).find('td').eq(1).text().trim();
    const author = $("table.infotable tr").eq(3).find('td').eq(1).text().trim();
    const artist = $("table.infotable tr").eq(4).find('td').eq(1).text().trim();
    const updatedOn = $("table.infotable tr").eq(7).find('time').text().trim();
    
    const genres = [];
    $(".seriestugenre a").each((index, element) => {
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
    "https://kiryuu02.com/manga/?status=ongoing&type=manhwa&order=";
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
  const url = `https://kiryuu02.com/${chapterId}`;

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
  const url = "https://kiryuu02.com/manga/list-mode/";

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

//bacakomik
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
