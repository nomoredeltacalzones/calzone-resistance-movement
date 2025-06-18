const nodemailer = require('nodemailer');

// Netlify Function for sending newsletters via Mailgun
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { newsletter, subscribers, testMode = true } = JSON.parse(event.body);
    
    // Mailgun configuration from environment variables
    const emailConfig = {
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILGUN_SMTP_LOGIN, // Your Mailgun SMTP login
        pass: process.env.MAILGUN_SMTP_PASSWORD // Your Mailgun SMTP password
      }
    };

    // Validate required environment variables
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      throw new Error('Mailgun configuration missing. Set MAILGUN_SMTP_LOGIN and MAILGUN_SMTP_PASSWORD environment variables.');
    }

    const transporter = nodemailer.createTransporter(emailConfig);
    
    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('Mailgun SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('Mailgun SMTP verification failed:', verifyError);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }
    
    // Convert newsletter object to HTML and text
    const htmlContent = convertNewsletterToHTML(newsletter);
    const textContent = convertNewsletterToText(newsletter);
    
    const results = [];
    const recipientList = testMode ? 
      [{ email: process.env.TEST_EMAIL || 'test@example.com', name: 'Test User' }] : 
      subscribers;

    // Send emails with proper error handling
    for (const subscriber of recipientList) {
      try {
        const mailOptions = {
          from: `"Calzone Resistance HQ" <saveme@nomorecalzones.com>`,
          to: subscriber.email,
          subject: `🚨 Resistance Intelligence Briefing #${newsletter.header.issueNumber} - Day ${newsletter.header.resistanceDay}`,
          text: textContent,
          html: htmlContent,
          // Mailgun-specific headers for tracking and analytics
          'h:X-Mailgun-Variables': JSON.stringify({
            newsletter_id: newsletter.header.issueNumber,
            resistance_day: newsletter.header.resistanceDay,
            subscriber_id: subscriber.id || 'unknown'
          }),
          'h:X-Mailgun-Tag': 'newsletter',
          'h:X-Mailgun-Campaign-Id': `resistance-briefing-${newsletter.header.issueNumber}`
        };

        const result = await transporter.sendMail(mailOptions);
        results.push({ 
          email: subscriber.email, 
          status: 'sent', 
          messageId: result.messageId,
          response: result.response
        });
        
        // Add small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        results.push({ 
          email: subscriber.email, 
          status: 'failed', 
          error: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sent: successCount,
        failed: failureCount,
        total: results.length,
        results: results,
        testMode,
        timestamp: new Date().toISOString(),
        mailgunConfig: {
          host: emailConfig.host,
          port: emailConfig.port,
          user: emailConfig.auth.user
        }
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

function convertNewsletterToHTML(newsletter) {
  const { header, fieldReports, intelligence, tacticalUpdates, survivalTips, resistanceHumor, callToAction, footer } = newsletter;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calzone Resistance Newsletter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #2c3e50;
        }
        .container {
            background-color: #34495e;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            color: #ecf0f1;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 { color: #e74c3c; font-size: 24px; margin: 0; }
        h2 { color: #f39c12; border-bottom: 2px solid #e74c3c; padding-bottom: 5px; }
        h3 { color: #3498db; }
        .section {
            margin: 30px 0;
            padding: 20px;
            background-color: #2c3e50;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
        }
        .crime-alert {
            background-color: #c0392b;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            font-weight: bold;
        }
        .member-spotlight {
            background-color: #27ae60;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .stat-item {
            text-align: center;
            padding: 10px;
            background-color: #34495e;
            border-radius: 5px;
            margin: 5px;
            min-width: 120px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #e74c3c;
        }
        .testimonial {
            font-style: italic;
            border-left: 4px solid #f39c12;
            padding-left: 15px;
            margin: 15px 0;
            background-color: #34495e;
            padding: 15px;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #7f8c8d;
            font-size: 12px;
            color: #95a5a6;
            text-align: center;
        }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .cta-button {
            display: inline-block;
            background-color: #e74c3c;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 5px;
        }
        .joke-box {
            background-color: #8e44ad;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 RESISTANCE INTELLIGENCE BRIEFING #${header.issueNumber}</h1>
            <p><strong>Day ${header.resistanceDay} of the Calzone Resistance</strong></p>
            <p><em>CLASSIFIED DOCUMENT - FOR RESISTANCE MEMBERS ONLY</em></p>
        </div>

        <div class="crime-alert">
            <h3>🎯 FEATURED CALZONE CRIME OF THE WEEK</h3>
            <p>${header.featuredCrime}</p>
        </div>

        <div class="member-spotlight">
            <h3>👤 RESISTANCE MEMBER SPOTLIGHT</h3>
            <p><strong>${header.memberSpotlight.name}</strong> - <em>${header.memberSpotlight.achievement}</em></p>
        </div>

        <div class="section">
            <h2>📡 FIELD REPORTS FROM 30,000 FEET</h2>
            <h3>Recent Encounters with the Enemy</h3>
            ${fieldReports.recentEncounters.map(report => `<p>• ${report}</p>`).join('')}
            
            <h3>Survivor Testimonials</h3>
            ${fieldReports.testimonials.map(t => `
                <div class="testimonial">
                    <p>"${t.quote}"</p>
                    <p><strong>- ${t.author}</strong></p>
                </div>
            `).join('')}

            ${fieldReports.realComplaints.length > 0 ? `
                <h3>Real Intelligence from Social Media</h3>
                ${fieldReports.realComplaints.map(complaint => `
                    <div class="testimonial">
                        <p>"${complaint.content}"</p>
                        <p><strong>- ${complaint.author} (${complaint.platform})</strong></p>
                    </div>
                `).join('')}
            ` : ''}
        </div>

        <div class="section">
            <h2>🕵️ INTELLIGENCE GATHERING</h2>
            <h3>Industry Surveillance Report</h3>
            ${intelligence.industryNews.map(news => `
                <p><strong>${news.title}</strong><br>
                <em>${news.source}</em> - ${news.summary}</p>
            `).join('')}
            
            <h3>Competitor Analysis</h3>
            ${intelligence.competitorAnalysis.map(analysis => `<p>• ${analysis}</p>`).join('')}
            
            <h3>Threat Assessment</h3>
            <p><strong>${intelligence.threatAssessment}</strong></p>
        </div>

        <div class="section">
            <h2>⚡ TACTICAL UPDATES</h2>
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${tacticalUpdates.memberCount.toLocaleString()}</div>
                    <div>Active Members</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${tacticalUpdates.complaintCount.toLocaleString()}</div>
                    <div>Filed Complaints</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">0</div>
                    <div>Satisfied Customers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${tacticalUpdates.daysSinceEdible}</div>
                    <div>Days Since Edible</div>
                </div>
            </div>
            
            <h3>Recent Victories</h3>
            ${tacticalUpdates.recentVictories.map(victory => `<p>• ${victory}</p>`).join('')}
            
            <h3>Ongoing Operations</h3>
            ${tacticalUpdates.ongoingOperations.map(op => `<p>• ${op}</p>`).join('')}
        </div>

        <div class="section">
            <h2>🛡️ SURVIVAL TIPS</h2>
            <h3>This Week's Tactical Advice</h3>
            <p><strong>${survivalTips.weeklyTip}</strong></p>
            
            <h3>Emergency Protocols</h3>
            ${survivalTips.emergencyProtocols.map((protocol, i) => `<p>${i + 1}. ${protocol}</p>`).join('')}
            
            <h3>Recommended Alternatives</h3>
            ${survivalTips.alternatives.map(alt => `<p>• ${alt}</p>`).join('')}
        </div>

        <div class="section">
            <h2>😂 RESISTANCE HUMOR</h2>
            <div class="joke-box">
                <h3>Meme of the Week</h3>
                <p><em>${resistanceHumor.memeDescription}</em></p>
            </div>
            
            <h3>Calzone Jokes</h3>
            <p>${resistanceHumor.joke}</p>
            
            <h3>Satirical News</h3>
            <p>${resistanceHumor.satiricalNews}</p>
        </div>

        <div class="section">
            <h2>📢 CALL TO ACTION</h2>
            <h3>Mission Objectives for This Week</h3>
            ${callToAction.missionObjectives.map(obj => `<p>• ${obj}</p>`).join('')}
            
            <h3>How You Can Help</h3>
            ${callToAction.helpMethods.map(method => `<p>• ${method}</p>`).join('')}
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://instagram.com/${footer.socialMedia.instagram}" class="cta-button">Follow on Instagram</a>
                <a href="mailto:${footer.socialMedia.email}" class="cta-button">Report Calzone Sighting</a>
            </div>
        </div>

        <div class="footer">
            <h3>📱 STAY CONNECTED</h3>
            <p>
                <strong>Instagram:</strong> <a href="https://instagram.com/${footer.socialMedia.instagram}">@${footer.socialMedia.instagram}</a><br>
                <strong>Website:</strong> <a href="https://${footer.socialMedia.website}">${footer.socialMedia.website}</a><br>
                <strong>Email:</strong> <a href="mailto:${footer.socialMedia.email}">${footer.socialMedia.email}</a>
            </p>
            
            <p><strong>🔒 SECURITY NOTICE</strong><br>
            This transmission is encrypted and intended only for verified resistance members.</p>
            
            <p><strong>⚖️ LEGAL DISCLAIMER</strong><br>
            ${footer.disclaimer}</p>
            
            <p><em>The Calzone Resistance Movement - United we stand against culinary crimes at altitude</em></p>
            
            <p>
                <a href="#unsubscribe">Unsubscribe</a> | 
                <a href="#preferences">Update Preferences</a> | 
                <a href="#forward">Forward to Fellow Survivor</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

function convertNewsletterToText(newsletter) {
  const { header, fieldReports, intelligence, tacticalUpdates, survivalTips, resistanceHumor, callToAction, footer } = newsletter;
  
  return `
🚨 RESISTANCE INTELLIGENCE BRIEFING #${header.issueNumber}
Day ${header.resistanceDay} of the Calzone Resistance

CLASSIFIED DOCUMENT - FOR RESISTANCE MEMBERS ONLY

🎯 FEATURED CALZONE CRIME OF THE WEEK
${header.featuredCrime}

👤 RESISTANCE MEMBER SPOTLIGHT
${header.memberSpotlight.name} - ${header.memberSpotlight.achievement}

📡 FIELD REPORTS FROM 30,000 FEET

Recent Encounters:
${fieldReports.recentEncounters.map(report => `• ${report}`).join('\n')}

Survivor Testimonials:
${fieldReports.testimonials.map(t => `"${t.quote}" - ${t.author}`).join('\n')}

🕵️ INTELLIGENCE GATHERING
${intelligence.industryNews.map(news => `${news.title} (${news.source}): ${news.summary}`).join('\n')}

Threat Assessment: ${intelligence.threatAssessment}

⚡ TACTICAL UPDATES
• Active Members: ${tacticalUpdates.memberCount.toLocaleString()}
• Filed Complaints: ${tacticalUpdates.complaintCount.toLocaleString()}
• Satisfied Customers: 0
• Days Since Edible: ${tacticalUpdates.daysSinceEdible}

Recent Victories:
${tacticalUpdates.recentVictories.map(victory => `• ${victory}`).join('\n')}

🛡️ SURVIVAL TIPS
This Week's Advice: ${survivalTips.weeklyTip}

😂 RESISTANCE HUMOR
${resistanceHumor.joke}

📢 CALL TO ACTION
${callToAction.missionObjectives.map(obj => `• ${obj}`).join('\n')}

📱 STAY CONNECTED
Instagram: @${footer.socialMedia.instagram}
Website: ${footer.socialMedia.website}
Email: ${footer.socialMedia.email}

${footer.disclaimer}

The Calzone Resistance Movement - United we stand against culinary crimes at altitude
`;
}

