import axios from 'axios';
import * as cheerio from 'cheerio';

interface MetaData {
  title: string;
  description: string;
  image: string;
}

export async function fetchMetaTags(url: string): Promise<MetaData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);

    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      'Demo';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      'Interactive demo';

    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="image"]').attr('content') ||
      '';

    return { title, description, image };
  } catch (error) {
    console.error('Error fetching meta tags:', error);
    return {
      title: 'Demo',
      description: 'Interactive demo',
      image: ''
    };
  }
}