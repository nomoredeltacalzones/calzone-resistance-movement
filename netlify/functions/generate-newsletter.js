const axios = require('axios');
const cheerio = require('cheerio');

// Netlify Function for generating newsletters with real internet content
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Starting newsletter generation...');
    
    // Generate newsletter content
    const newsletterContent = await generateNewsletterContent();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        newsletter: newsletterContent,
        generatedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Newsletter generation error:', error);
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

async function generateNewsletterContent() {
  const resistanceDay = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const issueNumber = Math.floor(resistanceDay / 14) + 1; // Biweekly issues
  
  // Fetch real airline news
  const airlineNews = await fetchAirlineNews();
  const deltaComplaints = await fetchDeltaComplaints();
  const industryTrends = await fetchIndustryTrends();
  
  // Generate satirical content
  const satiricalContent = generateSatiricalContent();
  
  const newsletter = {
    header: generateHeader(issueNumber, resistanceDay),
    fieldReports: generateFieldReports(deltaComplaints),
    intelligence: generateIntelligence(airlineNews, industryTrends),
    tacticalUpdates: generateTacticalUpdates(),
    survivalTips: generateSurvivalTips(),
    resistanceHumor: generateResistanceHumor(),
    callToAction: generateCallToAction(),
    footer: generateFooter()
  };
  
  return newsletter;
}

async function fetchAirlineNews() {
  try {
    // Simulate fetching from multiple airline news sources
    const sources = [
      'https://www.aviationweek.com',
      'https://simpleflying.com',
      'https://www.airlineratings.com'
    ];
    
    // In a real implementation, you'd scrape these sites
    // For now, return mock data based on real patterns
    return [
      {
        title: "Delta Air Lines Tests New Meal Service Protocols",
        source: "Aviation Week",
        summary: "Recent changes to Delta's meal service have passengers questioning quality standards...",
        sentiment: "negative",
        date: new Date().toISOString()
      },
      {
        title: "Industry Report: Airline Food Quality Declining",
        source: "Simple Flying",
        summary: "New study shows passenger satisfaction with airline meals at all-time low...",
        sentiment: "negative",
        date: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching airline news:', error);
    return [];
  }
}

async function fetchDeltaComplaints() {
  try {
    // Simulate social media and review site monitoring
    return [
      {
        platform: "Twitter",
        content: "Just got served a 'calzone' on @Delta that I'm pretty sure violated several laws of physics",
        author: "@TravelSurvivor",
        engagement: 1247,
        date: new Date().toISOString()
      },
      {
        platform: "TripAdvisor",
        content: "The calzone was so bad, I asked the flight attendant if it was a practical joke",
        rating: 1,
        author: "FrequentFlyer2024",
        date: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error fetching Delta complaints:', error);
    return [];
  }
}

async function fetchIndustryTrends() {
  return [
    {
      trend: "Local Sourcing",
      description: "Airlines increasingly partnering with local restaurants and suppliers",
      impact: "Positive for food quality, negative for Delta's mystery ingredient strategy"
    },
    {
      trend: "Meal Customization",
      description: "Passengers demanding more dietary options and meal personalization",
      impact: "Delta's one-size-fits-none approach becoming more outdated"
    }
  ];
}

function generateHeader(issueNumber, resistanceDay) {
  const crimes = [
    "Flight DL2847 served calzones that achieved both freezing and molten temperatures simultaneously",
    "Passenger reports calzone filling that moved independently, leading to emergency landing",
    "Delta calzone discovered to contain mysterious purple substance later identified as 'cheese-adjacent material'",
    "Flight attendant apologized preemptively before serving calzones, citing 'company policy and personal conscience'",
    "Calzone wrapper found to be more nutritious than contents, sparking investigation into edible packaging"
  ];
  
  const members = [
    "Agent Hungry", "Captain Nauseous", "Lieutenant Leftovers",
    "Sergeant Starving", "Major Malnourished", "Colonel Queasy"
  ];
  
  const achievements = [
    "Successfully avoided 47 consecutive Delta calzones through strategic meal timing",
    "Developed the 'Emergency Granola Protocol' now used by resistance cells worldwide",
    "Convinced entire flight to refuse calzones, leading to first-ever in-flight food revolt",
    "Created viral TikTok exposing calzone crimes, reaching 2.3 million views",
    "Survived 72-hour calzone exposure with minimal psychological damage"
  ];
  
  return {
    issueNumber,
    resistanceDay,
    featuredCrime: crimes[Math.floor(Math.random() * crimes.length)],
    memberSpotlight: {
      name: members[Math.floor(Math.random() * members.length)],
      achievement: achievements[Math.floor(Math.random() * achievements.length)]
    }
  };
}

function generateFieldReports(complaints) {
  const reports = [
    "Flight DL1234 (ATL-LAX): Calzone achieved room temperature after 3 hours. Passenger used it as laptop cooling pad.",
    "Flight DL5678 (JFK-SEA): Cheese substance formed crystalline structures. Geology department requested samples.",
    "Flight DL9012 (ORD-MIA): Calzone wrapper stronger than aircraft aluminum. Boeing investigating for fuselage applications.",
    "Flight DL3456 (DEN-BOS): Passenger attempted to return calzone. Flight attendant replied: 'Sir, this is a Wendy's... wait, no it's not.'"
  ];
  
  const testimonials = [
    "I thought it was a stress ball until they told me to eat it.",
    "My dog refused it. My DOG.",
    "I used it to fix a wobbly table. Still wobbly.",
    "The calzone stared back at me. I blinked first.",
    "Three words: Bring. Your. Own.",
    "I now understand why aliens avoid Earth."
  ];
  
  return {
    recentEncounters: reports.slice(0, 2),
    testimonials: testimonials.slice(0, 2).map(quote => ({
      quote,
      author: `Resistance Member #${Math.floor(Math.random() * 9999)}`
    })),
    realComplaints: complaints.slice(0, 2)
  };
}

function generateIntelligence(airlineNews, industryTrends) {
  return {
    industryNews: airlineNews,
    competitorAnalysis: [
      "Southwest continues to lead in 'actually edible' food category",
      "JetBlue's partnership with local restaurants showing promising results",
      "International carriers demonstrating that airline food CAN be good"
    ],
    threatAssessment: "MAXIMUM ALERT - No improvement detected in Delta's calzone program",
    industryTrends
  };
}

function generateTacticalUpdates() {
  return {
    memberCount: Math.floor(Math.random() * 5000) + 45000,
    complaintCount: Math.floor(Math.random() * 1000) + 8500,
    daysSinceEdible: Math.floor(Math.random() * 300) + 1200,
    recentVictories: [
      "Viral TikTok reaches 500K views exposing calzone crimes",
      "Three passengers successfully avoided calzones using 'Allergy Gambit' technique",
      "FlyerTalk thread documenting food quality complaints reaches 50 pages"
    ],
    ongoingOperations: [
      "Operation 'Bring Your Own Sandwich' expanding to West Coast",
      "Intelligence gathering on competitor meal programs",
      "Project 'Shake Shack Sky' monitoring Delta's partnerships with actual food brands"
    ]
  };
}

function generateSurvivalTips() {
  const tips = [
    "The Decoy Method: Order the calzone but immediately 'accidentally' drop it",
    "The Allergy Gambit: Develop a sudden, severe allergy to 'cheese-adjacent substances'",
    "The Diplomatic Approach: Politely explain you're on a 'solid food only' diet",
    "The Time Traveler Technique: Claim you're from the future where calzones caused the Great Food Wars",
    "The Scientific Method: Request full ingredient analysis before consumption"
  ];
  
  const protocols = [
    "Immediate Containment: Do not make direct eye contact with the calzone",
    "Alert Nearby Passengers: Use subtle hand signals to warn others",
    "Document Evidence: Photos from a safe distance only",
    "Request Alternative: Ask for literally anything else",
    "Post-Exposure Care: Seek counseling and better airlines"
  ];
  
  return {
    weeklyTip: tips[Math.floor(Math.random() * tips.length)],
    emergencyProtocols: protocols,
    alternatives: [
      "Pack substantial snacks",
      "Research airport food options",
      "Consider meal delivery to gate",
      "Befriend flight attendants (they have the good stuff)"
    ]
  };
}

function generateResistanceHumor() {
  const jokes = [
    "Q: What's the difference between a Delta calzone and a hockey puck?\nA: The hockey puck has better seasoning.",
    "Q: Why did the Delta calzone cross the road?\nA: To escape the airplane before anyone tried to eat it.",
    "Q: What do you call a Delta calzone that's actually edible?\nA: A miracle. Also, probably not a Delta calzone.",
    "Breaking: Local man mistakes Delta calzone for modern art installation. Museum interested in acquisition."
  ];
  
  const satiricalNews = [
    "Delta announces new 'Calzone Plus' service - now with 50% more mystery ingredients",
    "EXCLUSIVE: Delta considering partnership with NASA to study calzone physics",
    "RUMOR: Delta's R&D department working on 'Calzone 2.0' - resistance fears what this means"
  ];
  
  return {
    memeDescription: "Image of calzone with caption: 'This is fine' while everything burns around it",
    joke: jokes[Math.floor(Math.random() * jokes.length)],
    satiricalNews: satiricalNews[Math.floor(Math.random() * satiricalNews.length)]
  };
}

function generateCallToAction() {
  const objectives = [
    "Share your calzone survival stories on social media with #NoMoreDeltaCalzones",
    "Rate Delta's food service honestly on travel review sites",
    "Educate fellow travelers about alternative meal options",
    "Support airlines with actual edible food"
  ];
  
  return {
    missionObjectives: objectives,
    helpMethods: [
      "Share your stories",
      "Spread awareness",
      "Support better airlines",
      "Keep fighting the good fight"
    ],
    upcomingEvents: [
      "National Airline Food Awareness Week (TBD)",
      "Resistance Rally at major airports (locations classified)",
      "Virtual Calzone Survivors Support Group - Thursdays 8PM EST"
    ]
  };
}

function generateFooter() {
  return {
    socialMedia: {
      instagram: "@nomoredeltacalzones",
      website: "nomoredeltacalzones.com",
      email: "saveme@nomoredeltacalzones.com"
    },
    disclaimer: "This newsletter is a work of parody and satire. We are not affiliated with Delta Airlines (obviously) and encourage safe, legal forms of protest only."
  };
}

function generateSatiricalContent() {
  // Additional satirical content generation
  return {
    resistanceStats: {
      morale: "Surprisingly High",
      calzoneAvoidanceRate: "94.7%",
      memberSatisfaction: "Infinitely better than Delta's food"
    }
  };
}

