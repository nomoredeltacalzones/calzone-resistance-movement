const axios = require('axios');
const cheerio = require('cheerio');

// Enhanced internet scraping function for real airline content
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Starting internet content scraping...');
    
    const scrapedContent = await scrapeAirlineContent();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        content: scrapedContent,
        scrapedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

async function scrapeAirlineContent() {
  const content = {
    deltaNews: await scrapeDeltaNews(),
    airlineIndustryNews: await scrapeAirlineIndustryNews(),
    socialMediaMentions: await scrapeSocialMediaMentions(),
    competitorNews: await scrapeCompetitorNews(),
    foodQualityReports: await scrapeFoodQualityReports()
  };
  
  return content;
}

async function scrapeDeltaNews() {
  try {
    // Scrape multiple sources for Delta-specific news
    const sources = [
      {
        name: 'FlyerTalk Delta Forum',
        url: 'https://www.flyertalk.com/forum/delta-air-lines-skymiles/',
        selector: '.threadtitle a',
        type: 'forum'
      },
      {
        name: 'Delta Air Lines News',
        url: 'https://news.delta.com/',
        selector: '.news-item h3',
        type: 'official'
      }
    ];
    
    const deltaNews = [];
    
    for (const source of sources) {
      try {
        // Note: In production, you'd need to handle CORS and rate limiting
        // This is a simplified example
        const mockData = generateMockDeltaNews(source.name);
        deltaNews.push(...mockData);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        // Continue with other sources
      }
    }
    
    return deltaNews;
  } catch (error) {
    console.error('Error in scrapeDeltaNews:', error);
    return [];
  }
}

async function scrapeAirlineIndustryNews() {
  try {
    const sources = [
      'Aviation Week',
      'Simple Flying',
      'Airline Ratings',
      'Travel Weekly'
    ];
    
    const industryNews = [];
    
    for (const source of sources) {
      const mockData = generateMockIndustryNews(source);
      industryNews.push(...mockData);
    }
    
    return industryNews;
  } catch (error) {
    console.error('Error in scrapeAirlineIndustryNews:', error);
    return [];
  }
}

async function scrapeSocialMediaMentions() {
  try {
    // In production, you'd use Twitter API, Instagram API, etc.
    // For now, generate realistic mock data
    const platforms = ['Twitter', 'Instagram', 'TikTok', 'Reddit'];
    const mentions = [];
    
    for (const platform of platforms) {
      const mockMentions = generateMockSocialMentions(platform);
      mentions.push(...mockMentions);
    }
    
    return mentions;
  } catch (error) {
    console.error('Error in scrapeSocialMediaMentions:', error);
    return [];
  }
}

async function scrapeCompetitorNews() {
  try {
    const competitors = [
      'American Airlines',
      'United Airlines',
      'Southwest Airlines',
      'JetBlue Airways',
      'Alaska Airlines'
    ];
    
    const competitorNews = [];
    
    for (const competitor of competitors) {
      const mockData = generateMockCompetitorNews(competitor);
      competitorNews.push(...mockData);
    }
    
    return competitorNews;
  } catch (error) {
    console.error('Error in scrapeCompetitorNews:', error);
    return [];
  }
}

async function scrapeFoodQualityReports() {
  try {
    // Scrape food quality reports and reviews
    const sources = [
      'TripAdvisor',
      'Yelp',
      'Google Reviews',
      'Skytrax'
    ];
    
    const foodReports = [];
    
    for (const source of sources) {
      const mockData = generateMockFoodReports(source);
      foodReports.push(...mockData);
    }
    
    return foodReports;
  } catch (error) {
    console.error('Error in scrapeFoodQualityReports:', error);
    return [];
  }
}

// Mock data generators (in production, these would be real scraping functions)

function generateMockDeltaNews(source) {
  const headlines = [
    "Delta Introduces New Meal Service on Domestic Routes",
    "Passenger Complaints About Delta Food Quality Increase 23%",
    "Delta's Calzone Program Under Review Following Customer Feedback",
    "Flight Attendants Report Unusual Calzone-Related Incidents",
    "Delta Announces Partnership with Mystery Food Supplier",
    "New Study: Delta Calzones Defy Laws of Physics",
    "Passenger Uses Delta Calzone as Emergency Flotation Device",
    "Delta Food Service Team Wins 'Most Creative Use of Cheese-Adjacent Materials' Award"
  ];
  
  const summaries = [
    "Recent changes to meal service protocols have passengers questioning quality standards...",
    "Internal documents reveal concerning trends in food-related customer complaints...",
    "The controversial calzone program faces scrutiny from both passengers and crew...",
    "Flight attendants report incidents ranging from 'mildly concerning' to 'physically impossible'...",
    "New supplier's identity remains classified, ingredients list even more mysterious...",
    "Scientists baffled by calzones that achieve multiple temperature states simultaneously...",
    "Emergency landing avoided when passenger's quick thinking saves the day...",
    "Industry experts question whether this is actually an award worth winning..."
  ];
  
  return Array.from({ length: 3 }, (_, i) => ({
    source,
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    sentiment: Math.random() > 0.7 ? 'positive' : 'negative',
    engagement: Math.floor(Math.random() * 1000) + 100,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    url: `https://example.com/news/${i}`,
    category: 'delta-specific'
  }));
}

function generateMockIndustryNews(source) {
  const headlines = [
    "Airline Industry Embraces Local Sourcing for In-Flight Meals",
    "New Regulations Proposed for Airline Food Safety Standards",
    "Passenger Satisfaction with Airline Food Reaches All-Time Low",
    "Innovation in Airline Catering: What's Working and What's Not",
    "The Economics of Airline Food: Why Quality Matters",
    "Sustainable Aviation: Airlines Reduce Food Waste by 40%",
    "Technology Transforms Airline Meal Planning and Preparation",
    "International Airlines Set New Standards for In-Flight Dining"
  ];
  
  const summaries = [
    "Airlines increasingly partner with local restaurants and suppliers to improve meal quality...",
    "New safety standards could revolutionize how airlines prepare and serve food...",
    "Industry-wide survey reveals declining passenger satisfaction with meal service...",
    "Some airlines excel at food service while others struggle with basic quality...",
    "Analysis shows correlation between food quality and customer loyalty...",
    "Environmental initiatives drive changes in airline food service practices...",
    "AI and data analytics help airlines better predict passenger preferences...",
    "Global carriers demonstrate that airline food can be both good and profitable..."
  ];
  
  return Array.from({ length: 2 }, (_, i) => ({
    source,
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    sentiment: Math.random() > 0.5 ? 'neutral' : 'positive',
    date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    url: `https://example.com/industry/${i}`,
    category: 'industry-wide'
  }));
}

function generateMockSocialMentions(platform) {
  const deltaComplaints = [
    "Just got served a 'calzone' on @Delta that I'm pretty sure violated several laws of physics #DeltaFail",
    "Delta's calzone achieved the impossible: frozen AND molten at the same time. Science is broken. #AirlineFood",
    "Asked Delta flight attendant about the calzone ingredients. She just shook her head sadly. #NoMoreDeltaCalzones",
    "My dog took one look at the Delta calzone and filed for divorce. #TravelFail",
    "Delta calzone so bad it made me appreciate airplane peanuts. PEANUTS. #RockBottom",
    "Flight attendant apologized before even serving the calzone. That should have been my first clue. #DeltaExperience"
  ];
  
  const positiveCompetitor = [
    "Southwest's snacks are actually edible! What a concept! #SouthwestLove",
    "JetBlue's food game is strong. This is how airline meals should be done. #JetBlueEats",
    "Alaska Airlines proving that airline food doesn't have to be a punishment #AlaskaAir"
  ];
  
  const content = Math.random() > 0.7 ? 
    positiveCompetitor[Math.floor(Math.random() * positiveCompetitor.length)] :
    deltaComplaints[Math.floor(Math.random() * deltaComplaints.length)];
  
  return [{
    platform,
    content,
    author: `@TravelUser${Math.floor(Math.random() * 9999)}`,
    engagement: Math.floor(Math.random() * 5000) + 50,
    sentiment: content.includes('Southwest') || content.includes('JetBlue') || content.includes('Alaska') ? 'positive' : 'negative',
    date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: extractHashtags(content),
    category: 'social-media'
  }];
}

function generateMockCompetitorNews(competitor) {
  const improvements = [
    `${competitor} Partners with Local Chefs to Elevate In-Flight Dining`,
    `${competitor} Introduces Farm-to-Flight Meal Program`,
    `${competitor} Receives Award for Outstanding Airline Food Service`,
    `${competitor} Launches Premium Meal Options in Economy Class`,
    `${competitor} Reduces Food Waste While Improving Quality`
  ];
  
  const headline = improvements[Math.floor(Math.random() * improvements.length)];
  
  return [{
    source: 'Industry News',
    headline,
    summary: `${competitor} continues to innovate in airline food service, setting new standards for the industry...`,
    competitor,
    sentiment: 'positive',
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'competitor-news'
  }];
}

function generateMockFoodReports(source) {
  const reviews = [
    {
      rating: 1,
      comment: "Delta's calzone was an affront to Italian cuisine and basic human decency",
      airline: "Delta"
    },
    {
      rating: 2,
      comment: "I've had better food at gas stations. At least gas station food is identifiable.",
      airline: "Delta"
    },
    {
      rating: 4,
      comment: "Southwest's snacks were fresh and tasty. Simple but effective.",
      airline: "Southwest"
    },
    {
      rating: 5,
      comment: "JetBlue's meal was restaurant quality. Impressed!",
      airline: "JetBlue"
    }
  ];
  
  const review = reviews[Math.floor(Math.random() * reviews.length)];
  
  return [{
    source,
    rating: review.rating,
    comment: review.comment,
    airline: review.airline,
    reviewer: `Traveler${Math.floor(Math.random() * 9999)}`,
    date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    verified: Math.random() > 0.3,
    category: 'food-review'
  }];
}

function extractHashtags(text) {
  const hashtags = text.match(/#\w+/g);
  return hashtags || [];
}

// Utility function to analyze sentiment
function analyzeSentiment(text) {
  const negativeWords = ['bad', 'terrible', 'awful', 'disgusting', 'horrible', 'worst', 'fail', 'broken'];
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'delicious', 'love', 'best', 'perfect'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (negativeWords.includes(word)) score -= 1;
    if (positiveWords.includes(word)) score += 1;
  });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

