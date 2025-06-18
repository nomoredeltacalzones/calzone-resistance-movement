const cron = require('node-cron');

// Netlify Function for scheduled newsletter automation
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const action = event.queryStringParameters?.action || 'status';
    
    switch (action) {
      case 'generate':
        return await generateAndSendNewsletter();
      case 'schedule':
        return await setupSchedule();
      case 'status':
        return await getScheduleStatus();
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Scheduler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function generateAndSendNewsletter() {
  try {
    // Call the newsletter generation function
    const generateResponse = await fetch(`${process.env.URL}/.netlify/functions/generate-newsletter`);
    const newsletter = await generateResponse.json();
    
    if (!newsletter.success) {
      throw new Error('Newsletter generation failed');
    }
    
    // Get subscriber list (in production, this would come from a database)
    const subscribers = getSubscriberList();
    
    // Send the newsletter
    const sendResponse = await fetch(`${process.env.URL}/.netlify/functions/send-newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newsletter: newsletter.newsletter,
        subscribers: subscribers,
        testMode: process.env.NODE_ENV !== 'production'
      })
    });
    
    const sendResult = await sendResponse.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Newsletter generated and sent successfully',
        generatedAt: newsletter.generatedAt,
        emailResults: sendResult
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}

async function setupSchedule() {
  // Note: Netlify Functions don't support long-running processes
  // This would typically be handled by external services like:
  // - GitHub Actions with cron
  // - Zapier
  // - External cron services
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      message: 'Schedule setup instructions',
      recommendations: [
        {
          service: 'GitHub Actions',
          description: 'Use GitHub Actions with cron syntax to trigger newsletter generation',
          setup: 'Create .github/workflows/newsletter.yml with cron schedule'
        },
        {
          service: 'Zapier',
          description: 'Use Zapier to schedule HTTP requests to your Netlify function',
          setup: 'Create Zap with Schedule trigger and Webhook action'
        },
        {
          service: 'Netlify Build Hooks',
          description: 'Use external cron services to trigger Netlify build hooks',
          setup: 'Create build hook and use cron-job.org or similar service'
        }
      ]
    })
  };
}

async function getScheduleStatus() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      status: 'Ready for manual or external scheduling',
      lastGenerated: process.env.LAST_NEWSLETTER_DATE || 'Never',
      nextScheduled: 'Depends on external scheduler setup',
      availableActions: [
        'generate - Generate and send newsletter immediately',
        'schedule - Get scheduling setup instructions',
        'status - Get current status'
      ]
    })
  };
}

function getSubscriberList() {
  // In production, this would fetch from a database
  // For now, return a sample list
  return [
    {
      email: process.env.TEST_EMAIL || 'test@example.com',
      name: 'Test Subscriber',
      status: 'active',
      preferences: { format: 'html' }
    }
  ];
}

