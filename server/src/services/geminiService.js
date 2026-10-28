import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
let geminiClient = null;

if (apiKey && apiKey !== 'your_gemini_api_key_here') {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err.message);
  }
}

/**
 * Intelligent fallback generator tuned for Indian Rupee (INR ₹) budgets, guest sizes,
 * and culture-specific nuances (Weddings, Birthdays, Community Events).
 */
export function generateFallbackEventPlan(data) {
  const {
    eventType = 'Wedding',
    name = 'Celebration Event',
    guestCount = 100,
    totalBudget = 500000,
    eventDate = '2026-11-20',
    location = 'Mumbai',
    theme = '',
    foodPreference = '',
    culturalPreference = '',
    venuePreference = '',
    specialRequirements = ''
  } = data;

  const budgetNum = Number(totalBudget) || 500000;
  const guestNum = Number(guestCount) || 100;

  // Realistic budget distribution percentages
  let budgetBreakdown = [];
  if (eventType === 'Wedding') {
    budgetBreakdown = [
      { category: 'Venue and booking', percentage: 34, reason: 'Courtyard/hall booking, lighting, 2-day lawns & basic room block', savingTip: 'Opt for non-peak weekday or Sunday morning slots to negotiate up to 15% discount.' },
      { category: 'Food and catering', percentage: 30, reason: `Gourmet multi-meal spread for ${guestNum} guests at approx ₹${Math.round((budgetNum * 0.3) / Math.max(1, guestNum))} per guest`, savingTip: 'Consolidate live counters and avoid over-extending dessert options.' },
      { category: 'Decoration and flowers', percentage: 14, reason: 'Floral entrance, mandap/stage styling, ambient fairy lighting', savingTip: 'Use seasonal marigolds, jasmine, and reusable brass props over exotic imported blooms.' },
      { category: 'Photography and videography', percentage: 8, reason: 'Candid photography, 4K wedding highlight reel, drone coverage', savingTip: 'Book a unified photo-video boutique instead of hiring separate agencies.' },
      { category: 'Entertainment', percentage: 4, reason: 'Live DJ console, sound equipment, traditional folk or instrumental music', savingTip: 'Compile custom Sangeet audio tracks in advance to cut sound engineer billable hours.' },
      { category: 'Invitations and gifts', percentage: 3, reason: 'Digital video invites + custom curated gift hampers for close family', savingTip: 'Leverage animated digital cards for distant contacts and reserve physical hampers for VIP guests.' },
      { category: 'Transportation and accommodation', percentage: 3, reason: 'AC guest shuttles between hotel and venue', savingTip: 'Aggregate arrival slots to minimize empty shuttle trips.' },
      { category: 'Miscellaneous expenses', percentage: 2, reason: 'Puja materials, permits, groom/bride vanity touch-ups', savingTip: 'Keep a pre-audited cash pool with an assigned family treasurer.' },
      { category: 'Emergency contingency fund', percentage: 2, reason: 'Reserved safety buffer (5-10% dynamic emergency reserve)', savingTip: 'Do not allocate until 48 hours prior to the main function.' }
    ];
  } else if (eventType === 'Birthday') {
    budgetBreakdown = [
      { category: 'Venue and booking', percentage: 28, reason: 'Private rooftop / party lounge reservation with dedicated audio', savingTip: 'Host during afternoon brunch hours or Sunday evening for lower minimum spends.' },
      { category: 'Food and catering', percentage: 36, reason: `Party appetizers, woodfired mains, craft mocktails & artisanal cake for ${guestNum} guests`, savingTip: 'Opt for finger foods and buffet style instead of multi-course table service.' },
      { category: 'Decoration and flowers', percentage: 14, reason: 'Custom neon light art, balloon cascades, thematic photo backdrop', savingTip: 'Rent reusable neon signage and modular geometric arch frames.' },
      { category: 'Photography and videography', percentage: 7, reason: 'High-energy candid photographer & reel maker', savingTip: 'Hire for 3 peak hours instead of a full-day package.' },
      { category: 'Entertainment', percentage: 7, reason: 'DJ, emcee/games host, interactive gaming/arcade gear', savingTip: 'Design community crowd-trivia games using party apps.' },
      { category: 'Invitations and gifts', percentage: 4, reason: 'Curated return favors & digital invitations', savingTip: 'Offer personalized eco-friendly seed-paper or succulent favors.' },
      { category: 'Emergency contingency fund', percentage: 4, reason: 'Unplanned guest count increase or extra beverage rounds', savingTip: 'Release unused reserve at the end of the night.' }
    ];
  } else {
    // Community Event
    budgetBreakdown = [
      { category: 'Venue and booking', percentage: 30, reason: 'Public hall, community amphitheater or open park ground reservation and permits', savingTip: 'Check municipality subsidies for non-profit and community cultural events.' },
      { category: 'Food and catering', percentage: 25, reason: `Buffet refreshment, snack boxes, and hydration stations for ${guestNum} participants`, savingTip: 'Partner with local artisanal food truck vendors on revenue-share basis.' },
      { category: 'Decoration and flowers', percentage: 10, reason: 'Banners, stage trussing, directional signage and eco-friendly arches', savingTip: 'Employ recyclable bamboo and cloth banners that can be re-hung every year.' },
      { category: 'Photography and videography', percentage: 6, reason: 'Event documentarian and social media content creator', savingTip: 'Recruit talented community college photography students with stipends.' },
      { category: 'Entertainment', percentage: 12, reason: 'Stage PA sound system, mics, community performers, spotlight gear', savingTip: 'Encourage local talent showcases and volunteer acoustics.' },
      { category: 'Invitations and gifts', percentage: 5, reason: 'Community flyers, badges, wristbands and certificates/souvenirs', savingTip: 'Distribute digital QR passes via neighborhood messaging groups.' },
      { category: 'Transportation and accommodation', percentage: 4, reason: 'Volunteer logistics, equipment tempo, disabled parking guidance', savingTip: 'Encourage carpooling with designated parking marshals.' },
      { category: 'Emergency contingency fund', percentage: 8, reason: 'First-aid post, emergency generator, weather rain cover', savingTip: 'Store unused safety supplies for future community meets.' }
    ];
  }

  // Calculate actual currency allocation summing exactly to totalBudget
  let accumulated = 0;
  const budgetAllocations = budgetBreakdown.map((item, index) => {
    let amount = Math.round((item.percentage / 100) * budgetNum);
    accumulated += amount;
    if (index === budgetBreakdown.length - 1) {
      amount += (budgetNum - accumulated); // exact match
    }
    return {
      category: item.category,
      allocatedAmount: Math.max(0, amount),
      percentage: item.percentage,
      reason: item.reason,
      savingTip: item.savingTip
    };
  });

  // Calculate milestone timeline dates relative to eventDate
  const targetDate = new Date(eventDate);
  const now = new Date();
  const daysDiff = Math.max(14, Math.round((targetDate - now) / (1000 * 60 * 60 * 24)));

  const createDueDate = (offsetRatio) => {
    const d = new Date(now.getTime() + (daysDiff * offsetRatio * 24 * 60 * 60 * 1000));
    return d.toISOString().split('T')[0];
  };

  const timelineMilestones = [
    {
      title: 'Initial Concept & Budget Locking',
      milestone: 'Initial planning and budgeting',
      dueDate: createDueDate(0.15),
      priority: 'High',
      tasks: ['Define core aesthetic and vibe', 'Finalize maximum budget cap & emergency buffer', 'Appoint key planning committee members']
    },
    {
      title: 'Venue Shortlisting & Contract Signoff',
      milestone: 'Venue selection and booking',
      dueDate: createDueDate(0.3),
      priority: 'High',
      tasks: [`Inspect venues matching ${venuePreference || 'preferences'} in ${location}`, 'Verify sound license cutoff time', 'Pay initial reservation deposit']
    },
    {
      title: 'Key Vendors Contracting',
      milestone: 'Vendor research and confirmation',
      dueDate: createDueDate(0.5),
      priority: 'High',
      tasks: ['Book lead photographer and videographer', 'Schedule catering food tasting session', 'Select decorator and review 3D mockup renders']
    },
    {
      title: 'Guest List & RSVPs Rollout',
      milestone: 'Invitations and RSVPs',
      dueDate: createDueDate(0.7),
      priority: 'Medium',
      tasks: [`Dispatch invitations to ${guestNum} anticipated guests`, 'Track digital confirmation responses', 'Collate dietary restrictions and kids headcount']
    },
    {
      title: 'Décor Mockup & Catering Lockdown',
      milestone: 'Catering and decoration finalization',
      dueDate: createDueDate(0.85),
      priority: 'High',
      tasks: ['Sign off final menu items and live station counts', 'Confirm lighting truss, stage dimensions and seating layout', 'Inspect sound and generator backup plans']
    },
    {
      title: 'Final Rehearsals & Run-of-Show Rundown',
      milestone: 'Event-day schedule',
      dueDate: createDueDate(0.95),
      priority: 'High',
      tasks: ['Assemble minute-by-minute day schedule sheet', 'Assign point-of-contact phone numbers to all vendors', 'Distribute volunteer/crew briefing packets']
    },
    {
      title: 'Post-Event Wrap & Settlements',
      milestone: 'Post-event activities',
      dueDate: eventDate,
      priority: 'Medium',
      tasks: ['Verify final vendor bills against delivery milestones', 'Collect lost items & oversee rental returns', 'Send heartfelt thank-you notes and digital photo highlights']
    }
  ];

  // Vendor Checklist
  const vendorChecklist = [
    { category: 'Venues', priority: 'Critical', action: `Confirm ${venuePreference || 'capacity for ' + guestNum + ' guests'} with sound permits` },
    { category: 'Caterers', priority: 'Critical', action: `Lock ${foodPreference || 'multi-course menu'} with live food safety protocols` },
    { category: 'Decorators', priority: 'High', action: `Execute theme: ${theme || 'Atmospheric styling with warm lighting'}` },
    { category: 'Photographers', priority: 'High', action: 'Ensure 2 candid cameras, 1 traditional portrait, and teaser reel deliverable' },
    { category: 'DJs and entertainers', priority: 'Medium', action: 'Curate 4-hour playlist suited for audience age group' },
    { category: 'Florists', priority: 'Medium', action: 'Fresh floral arches, centerpieces, and stage garland deliveries' },
    { category: 'Transportation', priority: 'Low', action: 'Designate pickup zones and emergency drop vehicles' }
  ];

  // Theme details
  let generatedTheme = {};
  if (eventType === 'Wedding') {
    generatedTheme = {
      title: theme || 'Gilded Royal Flora & Starlit Charm',
      tagline: 'Timeless opulence woven with contemporary warmth',
      colorPalette: ['#7C3AED', '#D97706', '#F59E0B', '#FFFBEB', '#312E81'],
      description: `A breathtaking romantic aesthetic combining traditional ${culturalPreference || 'cultural elegance'} with cascading marigolds, golden accents, warm fairy light canopies, and regal velvet drapery.`
    };
  } else if (eventType === 'Birthday') {
    generatedTheme = {
      title: theme || 'Neon Glow & Electric Twilight',
      tagline: 'Bold, unforgettable moments under radiant lights',
      colorPalette: ['#8B5CF6', '#EC4899', '#06B6D4', '#0F172A', '#F8FAFC'],
      description: `An energetic high-spirited atmosphere featuring dynamic LED strip accents, luminous custom photo-zones, upbeat audio, and playful thematic tableware.`
    };
  } else {
    generatedTheme = {
      title: theme || 'Harmony in Green & Vibrant Community spirit',
      tagline: 'Connecting neighbors through shared smiles and sustainable joy',
      colorPalette: ['#10B981', '#6366F1', '#F59E0B', '#F8FAFC', '#1E293B'],
      description: `A welcoming, open, and accessible community landscape featuring eco-friendly biodegradable materials, intuitive signage, and open interactive pavilions.`
    };
  }

  return {
    theme: generatedTheme,
    venueAndCatering: {
      venueAdvice: `Recommend an accessible location in ${location} accommodating ${guestNum} guests comfortably with both covered and breezy open-air sections, verified power backup, and ample parking.`,
      cateringHighlights: [
        foodPreference ? `Customized menu: ${foodPreference}` : 'Crowd-pleasing balance of savoury appetizers, chef-curated live stations, and indulgent desserts',
        'Hydration and welcome mocktail bar designed to eliminate long queues',
        'Safe packaging and eco-friendly biodegradable cutlery'
      ]
    },
    entertainment: [
      eventType === 'Wedding' ? 'Grand entrance choreography with ambient sparklers & dhol beats' : (eventType === 'Birthday' ? 'Interactive crowd icebreakers, trivia challenge & high-energy live DJ' : 'Local community artists showcase, cultural dance, and open mic session'),
      'Thematic 3D interactive photo-booth with instant social-ready prints',
      'Curated ambient background playlist during dinner/networking hours'
    ],
    guestManagement: [
      'Digital RSVP tracking link with instant WhatsApp broadcast reminders',
      'Hospitality desk at entrance for guest orientation and favor distribution',
      'Accessible seating zones reserved for senior guests and families with toddlers'
    ],
    budgetBreakdown: budgetAllocations,
    timeline: timelineMilestones,
    vendorChecklist,
    contingencyAndRisks: [
      { risk: 'Sudden weather shift or unseasonal rain', mitigation: 'Ensure venue provides waterproof tensile canopy or immediate backup banquet hall.' },
      { risk: 'Guest count exceeds RSVP by 10-15%', mitigation: 'Pre-negotiate a 10% flexible catering margin with the head chef.' },
      { risk: 'Power outage or sound equipment trip', mitigation: 'Mandate silent diesel backup generator (minimum 25 kVA) in vendor contract.' }
    ],
    generatedAt: new Date().toISOString(),
    isAiLive: false,
    note: 'Generated using EventEase Heuristic Planner (Live Gemini AI available when configured).'
  };
}

/**
 * Generate Event Plan with Gemini API (Model: gemini-3.8-flash)
 */
export async function generateEventPlan(eventData) {
  if (!geminiClient) {
    return generateFallbackEventPlan(eventData);
  }

  const prompt = `
You are EventEase AI, a world-class premier event planning intelligence.
Analyze the following event parameters and generate a comprehensive, highly personalized, realistic event plan:

Parameters:
- Event Type: ${eventData.eventType} (Wedding / Birthday / Community Event)
- Event Name: ${eventData.name}
- Description: ${eventData.description || 'N/A'}
- Date: ${eventData.eventDate}
- Location: ${eventData.location}
- Expected Guest Count: ${eventData.guestCount}
- Total Budget: INR ₹${eventData.totalBudget} (Indian Rupees)
- Preferred Theme/Decor: ${eventData.theme || 'Open to AI suggestions'}
- Food & Catering: ${eventData.foodPreference || 'Standard celebration feast'}
- Cultural/Regional Preferences: ${eventData.culturalPreference || 'General Indian/Modern'}
- Venue Preference: ${eventData.venuePreference || 'Indoor / Outdoor'}
- Special Requirements: ${eventData.specialRequirements || 'None'}

Return ONLY a valid JSON object strictly matching this schema with no markdown code blocks around it:
{
  "theme": {
    "title": "Creative theme title",
    "tagline": "Memorable one-line tagline",
    "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "description": "2-3 sentences describing the visual ambiance, textures, and lighting."
  },
  "venueAndCatering": {
    "venueAdvice": "Realistic advice on venue space, capacity, layout, and licensing in the given location.",
    "cateringHighlights": ["Point 1", "Point 2", "Point 3"]
  },
  "entertainment": ["Activity 1", "Activity 2", "Activity 3"],
  "guestManagement": ["Guest strategy 1", "Guest strategy 2", "Guest strategy 3"],
  "budgetBreakdown": [
    {
      "category": "Venue and booking",
      "allocatedAmount": 0,
      "percentage": 30,
      "reason": "Detailed justification based on guest count and venue type",
      "savingTip": "Actionable cost-saving tip"
    }
  ],
  "timeline": [
    {
      "title": "Milestone title",
      "milestone": "Milestone phase name",
      "dueDate": "YYYY-MM-DD",
      "priority": "High | Medium | Low",
      "tasks": ["Subtask 1", "Subtask 2"]
    }
  ],
  "vendorChecklist": [
    {
      "category": "Category name",
      "priority": "Critical | High | Medium | Low",
      "action": "What to verify or book"
    }
  ],
  "contingencyAndRisks": [
    {
      "risk": "Potential hazard or disruption",
      "mitigation": "Realistic contingency plan"
    }
  ]
}

Ensure the sum of "allocatedAmount" across budgetBreakdown matches INR ${eventData.totalBudget} closely, includes an "Emergency contingency fund" around 5-10%, and dueDates in timeline are strictly on or before ${eventData.eventDate}.
`;

  try {
    const interaction = await geminiClient.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt
    });

    const responseText = interaction.output_text || '';
    // Clean potential markdown quotes
    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    parsed.isAiLive = true;
    parsed.generatedAt = new Date().toISOString();
    return parsed;
  } catch (err) {
    console.error('Gemini API Error, switching to fallback generator:', err.message);
    const fallback = generateFallbackEventPlan(eventData);
    fallback.aiError = err.message;
    return fallback;
  }
}

/**
 * Generate Personalized AI Ideas
 */
export async function generateIdeas(data) {
  const { eventType = 'Wedding', topic = 'all', guestCount = 100, budget = 500000, theme = '' } = data;

  if (!geminiClient) {
    return generateFallbackIdeas(data);
  }

  const prompt = `
Generate 6 brilliant, out-of-the-box creative ideas for an event with:
- Type: ${eventType}
- Topic: ${topic} (Themes, Decor, Food & Menu, Invitation wording, Entertainment, Return gifts, Photography concepts, Eco-friendly ideas, Low-budget alternatives)
- Guest Count: ${guestCount}
- Budget: INR ₹${budget}
- Style: ${theme}

Return ONLY a valid JSON array:
[
  {
    "id": "idea-1",
    "title": "Short catchy title",
    "category": "${topic}",
    "description": "Exciting, highly specific description",
    "budgetImpact": "Low | Moderate | Premium",
    "culturalFit": "Cultural or modern relevance",
    "practicalTip": "How to execute this effortlessly"
  }
]
`;

  try {
    const interaction = await geminiClient.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt
    });
    const cleaned = (interaction.output_text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Gemini ideas generation failed, using fallback:', err.message);
    return generateFallbackIdeas(data);
  }
}

function generateFallbackIdeas(data) {
  const { eventType = 'Wedding', topic = 'all' } = data;
  return [
    {
      id: 'idea-1',
      title: eventType === 'Wedding' ? 'Sunset Sangeet Brass & Velvet Canopy' : (eventType === 'Birthday' ? 'Glow-in-the-Dark Mocktail Lounge' : 'Neighborhood Artisanal Fair Pavilions'),
      category: 'Decor & Theme',
      description: 'Layered warm fairy light waterfalls combined with handcrafted local artisanal hanging lanterns creating an ethereal photographic glow.',
      budgetImpact: 'Moderate',
      culturalFit: 'Contemporary fusion with traditional warmth',
      practicalTip: 'Rent modular aluminum frame trusses and drape with reusable organza fabric.'
    },
    {
      id: 'idea-2',
      title: eventType === 'Wedding' ? 'Interactive Live Chaat & Clay Cup Kulhad Chai' : (eventType === 'Birthday' ? 'DIY Slider & Woodfired Pizza Counter' : 'Eco-Friendly Millet & Farm-to-Table Grazing Table'),
      category: 'Food & Catering',
      description: 'Engaging live cooking stations where guests customize toppings, spiced garnishes, and sweet reductions right in front of them.',
      budgetImpact: 'Low',
      culturalFit: 'Instant crowd favorite across all age groups',
      practicalTip: 'Limits food wastage while providing memorable interactive dining.'
    },
    {
      id: 'idea-3',
      title: 'Digital Cinematic Video Invites with WhatsApp RSVP Gateway',
      category: 'Invitation & Tech',
      description: 'A 45-second 3D motion graphic teaser with ambient soundtrack and a direct one-click WhatsApp RSVP button.',
      budgetImpact: 'Low',
      culturalFit: 'Modern paperless elegance',
      practicalTip: 'Saves up to ₹40,000 in printing and courier delays while collecting instant headcount data.'
    },
    {
      id: 'idea-4',
      title: eventType === 'Wedding' ? 'Pre-Wedding Drone Silhouette & Golden Hour Portraits' : (eventType === 'Birthday' ? 'Instant Polaroid Guestbook Memory Wall' : 'Community Photo Mosaic Mural'),
      category: 'Photography Concepts',
      description: 'Capturing candid guest expressions with instant retro prints that guests clip onto a backlit fairy-lit string line with handwritten wishes.',
      budgetImpact: 'Moderate',
      culturalFit: 'Heartwarming keepsake for years to come',
      practicalTip: 'Assign one enthusiastic volunteer to hand out instant print film cartridges.'
    },
    {
      id: 'idea-5',
      title: 'Living Plant Sapling / Organic Seed-Paper Return Gifts',
      category: 'Return Gifts & Favors',
      description: 'Mini terracotta potted succulents or wildflower seed-embedded personalized thank-you cards that bloom into flowers.',
      budgetImpact: 'Low',
      culturalFit: '100% Eco-friendly and memorable',
      practicalTip: 'Procure directly from local nursery cooperatives at wholesale rates.'
    },
    {
      id: 'idea-6',
      title: 'The Silent Disco / Acoustic Twilight After-Hours',
      category: 'Entertainment',
      description: 'Multi-channel wireless glowing headphones allowing guests to toggle between genres while strictly adhering to municipal sound curfew limits.',
      budgetImpact: 'Moderate',
      culturalFit: 'Youth & urban favourite',
      practicalTip: 'Completely eliminates venue noise pollution disputes after 10:00 PM.'
    }
  ];
}

/**
 * Generate Cost Saving Alternatives
 */
export async function generateCostSavings(budgetData) {
  const { totalBudget = 500000, currentExpenses = [], eventType = 'Wedding' } = budgetData;

  const totalSpent = currentExpenses.reduce((sum, item) => sum + (Number(item.actualAmount || item.estimatedAmount) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;

  return {
    isOverBudget,
    overBudgetAmount: isOverBudget ? Math.abs(remaining) : 0,
    recommendations: [
      {
        category: 'Food and catering',
        potentialSavings: Math.round(totalBudget * 0.06),
        advice: 'Limit the dessert and bread variety to top 3 signature items instead of 8 to eliminate unused prep costs.',
        action: 'Review buffet menu with the caterer and reduce 2 redundant live counters.'
      },
      {
        category: 'Decoration and flowers',
        potentialSavings: Math.round(totalBudget * 0.05),
        advice: 'Swap exotic imported flowers with locally grown marigolds, tuberoses, and ambient fairy lights.',
        action: 'Ask decorator for a minimalist floral package accented by warm LED wash lights.'
      },
      {
        category: 'Photography and videography',
        potentialSavings: Math.round(totalBudget * 0.03),
        advice: 'Contract the photography team for core ritual hours rather than paying for 12 continuous hours on standby.',
        action: 'Shift pre-wedding shoot to the same morning or venue to eliminate separate travel charges.'
      },
      {
        category: 'Invitations and gifts',
        potentialSavings: Math.round(totalBudget * 0.02),
        advice: 'Switch 70% of outstation guest invitations to premium animated digital cards.',
        action: 'Reserve physical handcrafted boxes exclusively for immediate elder relatives.'
      }
    ],
    summary: isOverBudget 
      ? `Budget is exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}. Implementing the recommendations above can recuperate up to ₹${Math.round(totalBudget * 0.16).toLocaleString('en-IN')}.`
      : `You are within budget with a healthy cushion of ₹${remaining.toLocaleString('en-IN')}. Keep remaining funds in the emergency contingency reserve.`
  };
}
