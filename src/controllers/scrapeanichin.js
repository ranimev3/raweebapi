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
