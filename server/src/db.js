import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed data
const getInitialData = () => {
  const salt = bcrypt.genSaltSync(10);
  const demoHashedPassword = bcrypt.hashSync('demo123', salt);

  const demoUserId = 'user-demo-001';

  const defaultEvents = [
    {
      id: 'event-wedding-01',
      userId: demoUserId,
      name: 'Ananya & Rohan’s Royal Jaipur Wedding',
      eventType: 'Wedding',
      description: 'A 3-day royal heritage destination wedding blending Rajasthani tradition with modern elegance.',
      eventDate: '2026-11-20',
      location: 'Jaipur, Rajasthan',
      guestCount: 250,
      totalBudget: 2500000, // 25 Lakhs INR
      theme: 'Royal Rajasthani Palace & Marigold Glow',
      foodPreference: 'Royal Rajputana Feast, North Indian, Live Chaat Counter & Global Dessert Bar',
      culturalPreference: 'Hindu Rajasthani Marwari Customs (Mehendi, Sangeet, Pheras)',
      venuePreference: 'Outdoor Heritage Courtyard & Lawns',
      specialRequirements: 'Eco-friendly fireworks, traditional Shehnai troupe, golf carts for elderly guests.',
      aiPlan: {
        theme: {
          title: 'Royal Rajasthani Heritage & Sunset Marigold',
          tagline: 'Regal majesty meets soulful Rajasthani warmth',
          colorPalette: ['#9333EA', '#D97706', '#F59E0B', '#FDF4FF', '#1E1B4B'],
          description: 'A grand celebration adorned with hand-carved jharokhas, brass lanterns, fresh marigold chandeliers, and velvet royal furnishings.'
        },
        venueAndCatering: {
          venueAdvice: 'Book a heritage Haveli or palace lawn in Kukas or Amer with 120+ rooms and an open courtyard for pheras under the stars.',
          cateringHighlights: [
            'Live Dal Baati Churma & Ker Sangri station',
            'Artisanal Chaat station with authentic sweet curd and tamarind glaze',
            'Midnight saffron masala milk & warm Gulab Jamun cart'
          ]
        },
        entertainment: [
          'Live Manganiyar folk musicians welcome at the gateway',
          'Sangeet DJ with Bollywood brass band fusion',
          'Interactive pottery making stall for daytime Mehendi guests'
        ],
        guestManagement: [
          'Pre-arranged airport pickup shuttles to heritage resort',
          'Luggage tags and personalized welcome hampers with Jaipur blue pottery trinkets',
          'Dedicated hospitality concierge desk at the lobby'
        ],
        contingencyAndRisks: [
          'Evening temperature drop in November: Provide plush pashmina shawls and outdoor patio heaters.',
          'Sound curfew at 10 PM: Shift after-party to an indoor acoustically treated banquet hall.'
        ],
        generatedAt: '2026-10-28T10:00:00.000Z'
      },
      createdAt: '2026-10-25T08:00:00.000Z'
    },
    {
      id: 'event-birthday-02',
      userId: demoUserId,
      name: 'Aarav’s Neon Arcade 30th Birthday Bash',
      eventType: 'Birthday',
      description: 'A high-energy 90s retro arcade & synthwave birthday party with craft mocktails and multiplayer tournaments.',
      eventDate: '2026-12-05',
      location: 'Bengaluru, Karnataka',
      guestCount: 60,
      totalBudget: 180000, // 1.8 Lakhs INR
      theme: 'Neon Synthwave & 90s Arcade Nostalgia',
      foodPreference: 'Gourmet sliders, Wood-fired pizzas, Loaded tacos & Craft Brews',
      culturalPreference: 'Cosmopolitan Modern',
      venuePreference: 'Indoor Rooftop Lounge with Neon Lighting',
      specialRequirements: 'Vintage retro arcade consoles, customized neon photo-booth, customized custom cake.',
      aiPlan: {
        theme: {
          title: 'Electric Cyberpunk & 90s Pixel Dreams',
          tagline: 'Leveling up to Chapter 30 in vivid neon glow',
          colorPalette: ['#A855F7', '#EC4899', '#06B6D4', '#0F172A', '#F8FAFC'],
          description: 'A vibrant retro-futuristic atmosphere with neon LED signage, retro gaming machines, and laser ambient lights.'
        },
        venueAndCatering: {
          venueAdvice: 'A rooftop microbrewery or private loft in Indiranagar/Koramangala with industrial aesthetics and dedicated dance floor.',
          cateringHighlights: [
            'Mini brioche burgers with truffle aioli',
            'Custom cocktail/mocktail tree with smoking dry-ice presentation',
            'Pixel-art 3D fondant cake flavored with Belgian dark chocolate'
          ]
        },
        entertainment: [
          'Street Fighter II & Mario Kart multiplayer tournament on a giant projector',
          'Synthwave and 90s hip-hop live DJ set',
          'Instant polaroid photo station with funky neon glasses & props'
        ],
        guestManagement: [
          'Digital arcade token passes sent via WhatsApp RSVP',
          'VIP glow wristbands that sync with music lighting'
        ],
        contingencyAndRisks: [
          'Power surge risk with multiple arcade rigs: Rent backup 15kVA silent generator.',
          'Guest spillover on terrace: Set up perimeter stanchions and clear safety signage.'
        ],
        generatedAt: '2026-10-28T10:00:00.000Z'
      },
      createdAt: '2026-10-26T09:00:00.000Z'
    }
  ];

  const defaultExpenses = [
    // Wedding Expenses
    {
      id: 'exp-w-1',
      eventId: 'event-wedding-01',
      title: 'Heritage Haveli Venue Booking & Lawn Deposit',
      category: 'Venue and booking',
      estimatedAmount: 900000,
      actualAmount: 850000,
      status: 'Paid',
      notes: 'Includes 2 night stays for 40 prime rooms and lawn for 250 guests',
      createdAt: '2026-10-25T10:00:00.000Z'
    },
    {
      id: 'exp-w-2',
      eventId: 'event-wedding-01',
      title: 'Royal Banquet Catering (3 Days, 5 Meals)',
      category: 'Food and catering',
      estimatedAmount: 750000,
      actualAmount: 720000,
      status: 'Paid',
      notes: '₹1400 per plate average across Sangeet, Mehendi, and Grand Reception',
      createdAt: '2026-10-25T11:00:00.000Z'
    },
    {
      id: 'exp-w-3',
      eventId: 'event-wedding-01',
      title: 'Marigold Mandap & Floral Decor Setup',
      category: 'Decoration and flowers',
      estimatedAmount: 350000,
      actualAmount: 380000,
      status: 'Partially Paid',
      notes: 'Fresh flowers sourced from Jaipur flower mandi with brass diya stands',
      createdAt: '2026-10-25T11:30:00.000Z'
    },
    {
      id: 'exp-w-4',
      eventId: 'event-wedding-01',
      title: 'Cinematic Photography & Drone Videography',
      category: 'Photography and videography',
      estimatedAmount: 200000,
      actualAmount: 190000,
      status: 'Partially Paid',
      notes: '3-day coverage with traditional album and 4K teaser trailer',
      createdAt: '2026-10-25T12:00:00.000Z'
    },
    {
      id: 'exp-w-5',
      eventId: 'event-wedding-01',
      title: 'Sangeet DJ, Sound Setup & Folk Musicians',
      category: 'Entertainment',
      estimatedAmount: 120000,
      actualAmount: 110000,
      status: 'Unpaid',
      notes: 'Stage trussing, sound, lights, and Rajasthani Manganiyar troupe',
      createdAt: '2026-10-25T12:30:00.000Z'
    },
    {
      id: 'exp-w-6',
      eventId: 'event-wedding-01',
      title: 'Luxury Boxed Invitations & Dry Fruit Hampers',
      category: 'Invitations and gifts',
      estimatedAmount: 80000,
      actualAmount: 75000,
      status: 'Paid',
      notes: 'Handmade paper invites with gilded foil stamping',
      createdAt: '2026-10-25T13:00:00.000Z'
    },
    {
      id: 'exp-w-7',
      eventId: 'event-wedding-01',
      title: 'Guest AC Tempo Travelers & Airport Shuttles',
      category: 'Transportation and accommodation',
      estimatedAmount: 60000,
      actualAmount: 55000,
      status: 'Unpaid',
      notes: '3 Tempo travelers on standby for airport transfers',
      createdAt: '2026-10-25T13:30:00.000Z'
    },
    {
      id: 'exp-w-8',
      eventId: 'event-wedding-01',
      title: 'Emergency Contingency Reserve',
      category: 'Emergency contingency fund',
      estimatedAmount: 150000,
      actualAmount: 0,
      status: 'Unpaid',
      notes: '6% safety margin for last minute requirements or weather shifts',
      createdAt: '2026-10-25T14:00:00.000Z'
    },
    // Birthday Expenses
    {
      id: 'exp-b-1',
      eventId: 'event-birthday-02',
      title: 'Lounge Terrace Booking & Sound Permit',
      category: 'Venue and booking',
      estimatedAmount: 65000,
      actualAmount: 60000,
      status: 'Paid',
      notes: 'Private rooftop section booked for 5 hours',
      createdAt: '2026-10-26T10:00:00.000Z'
    },
    {
      id: 'exp-b-2',
      eventId: 'event-birthday-02',
      title: 'Craft Sliders, Pizza Bar & Welcome Cocktails',
      category: 'Food and catering',
      estimatedAmount: 55000,
      actualAmount: 52000,
      status: 'Partially Paid',
      notes: '₹850 per head for 60 guests',
      createdAt: '2026-10-26T10:30:00.000Z'
    },
    {
      id: 'exp-b-3',
      eventId: 'event-birthday-02',
      title: 'Custom Neon Flex Signs & Glow Decor',
      category: 'Decoration and flowers',
      estimatedAmount: 25000,
      actualAmount: 24000,
      status: 'Paid',
      notes: '"Aarav Level 30" custom neon sign',
      createdAt: '2026-10-26T11:00:00.000Z'
    },
    {
      id: 'exp-b-4',
      eventId: 'event-birthday-02',
      title: 'Arcade Machine Rental & DJ Console',
      category: 'Entertainment',
      estimatedAmount: 22000,
      actualAmount: 20000,
      status: 'Unpaid',
      notes: '2 retro arcade consoles + 4 hour DJ set',
      createdAt: '2026-10-26T11:30:00.000Z'
    }
  ];

  const defaultTasks = [
    // Wedding Tasks
    {
      id: 'task-w-1',
      eventId: 'event-wedding-01',
      title: 'Finalize Heritage Haveli venue agreement & pay advance',
      category: 'Venue',
      milestone: 'Venue selection and booking',
      dueDate: '2026-08-15',
      priority: 'High',
      completed: true,
      assignedTo: 'Rohan & Family',
      notes: 'Confirmed 40 courtyard rooms and royal banquet lawn.'
    },
    {
      id: 'task-w-2',
      eventId: 'event-wedding-01',
      title: 'Taste and finalize 3-day Rajasthani & Continental menu',
      category: 'Catering',
      milestone: 'Catering and decoration finalization',
      dueDate: '2026-09-10',
      priority: 'High',
      completed: true,
      assignedTo: 'Ananya',
      notes: 'Included live Dal Baati Churma and chocolate fountain for sangeet.'
    },
    {
      id: 'task-w-3',
      eventId: 'event-wedding-01',
      title: 'Dispatch luxury wedding invitations & track digital RSVPs',
      category: 'Invitations',
      milestone: 'Invitations and RSVPs',
      dueDate: '2026-09-30',
      priority: 'Medium',
      completed: true,
      assignedTo: 'Wedding Secretariat',
      notes: '90% RSVPs collected, 250 confirmed guests.'
    },
    {
      id: 'task-w-4',
      eventId: 'event-wedding-01',
      title: 'Conduct Sangeet choreography rehearsals & DJ playlist briefing',
      category: 'Entertainment',
      milestone: 'Vendor research and confirmation',
      dueDate: '2026-11-05',
      priority: 'Medium',
      completed: false,
      assignedTo: 'Cousins Squad',
      notes: '3 group dances lined up; requested retro Bollywood tracks.'
    },
    {
      id: 'task-w-5',
      eventId: 'event-wedding-01',
      title: 'Review backup generator & rain canopy plan with decorator',
      category: 'Contingency',
      milestone: 'Event-day schedule',
      dueDate: '2026-11-15',
      priority: 'High',
      completed: false,
      assignedTo: 'Event Coordinator',
      notes: 'Inspect canopy frame for open lawn area.'
    },
    // Birthday Tasks
    {
      id: 'task-b-1',
      eventId: 'event-birthday-02',
      title: 'Book Indiranagar Rooftop Terrace & confirm sound license',
      category: 'Venue',
      milestone: 'Venue selection and booking',
      dueDate: '2026-11-01',
      priority: 'High',
      completed: true,
      assignedTo: 'Aarav',
      notes: 'Booking confirmed 7pm - 12am.'
    },
    {
      id: 'task-b-2',
      eventId: 'event-birthday-02',
      title: 'Order custom 3D Pixel Art chocolate fudge birthday cake',
      category: 'Catering',
      milestone: 'Catering and decoration finalization',
      dueDate: '2026-11-25',
      priority: 'Medium',
      completed: false,
      assignedTo: 'Priya',
      notes: '3 kg tier cake with neon glowing base.'
    },
    {
      id: 'task-b-3',
      eventId: 'event-birthday-02',
      title: 'Setup tournament bracket for Mario Kart competition',
      category: 'Activities',
      milestone: 'Event-day schedule',
      dueDate: '2026-12-02',
      priority: 'Low',
      completed: false,
      assignedTo: 'Samir',
      notes: 'Winner receives custom retro trophy.'
    }
  ];

  const defaultVendors = [
    // Wedding Vendors
    {
      id: 'ven-w-1',
      eventId: 'event-wedding-01',
      name: 'Amer Heritage Haveli & Lawns',
      category: 'Venues',
      contactPerson: 'Vikram Singh Shekhawat',
      phone: '+91 98290 12345',
      email: 'events@amerheritagehaveli.com',
      quotedPrice: 900000,
      agreedPrice: 850000,
      paymentStatus: 'Paid',
      bookingStatus: 'Booked',
      rating: 4.9,
      services: 'Lawn for 400 pax, 40 boutique rooms, bridal dressing suite, valet parking',
      notes: 'Heritage property with heritage arches and lighting included.',
      isSample: true
    },
    {
      id: 'ven-w-2',
      eventId: 'event-wedding-01',
      name: 'Shahi Rasoi Royal Gourmet Caterers',
      category: 'Caterers',
      contactPerson: 'Chef Manvendra Rathore',
      phone: '+91 94140 88765',
      email: 'contact@shahirasoiroyal.com',
      quotedPrice: 750000,
      agreedPrice: 720000,
      paymentStatus: 'Paid',
      bookingStatus: 'Booked',
      rating: 4.8,
      services: 'Multi-cuisine catering, live Rajasthani counters, organic clay crockery',
      notes: 'Tasting passed with 10/10 rating by both families.',
      isSample: true
    },
    {
      id: 'ven-w-3',
      eventId: 'event-wedding-01',
      name: 'Marigold & Velvet Floral Productions',
      category: 'Decorators',
      contactPerson: 'Megha Jindal',
      phone: '+91 98110 54321',
      email: 'megha@marigoldvelvet.in',
      quotedPrice: 380000,
      agreedPrice: 380000,
      paymentStatus: 'Partial',
      bookingStatus: 'Booked',
      rating: 4.7,
      services: 'Mandap, stage backdrop, fairy lights, floral chandeliers, entry arch',
      notes: 'Includes floral rangoli and candlelit pool installation.',
      isSample: true
    },
    {
      id: 'ven-w-4',
      eventId: 'event-wedding-01',
      name: 'Lens & Heritage Studios',
      category: 'Photographers',
      contactPerson: 'Kunal Verma',
      phone: '+91 97170 33221',
      email: 'kunal@lensheritagestudio.com',
      quotedPrice: 210000,
      agreedPrice: 190000,
      paymentStatus: 'Partial',
      bookingStatus: 'Booked',
      rating: 4.9,
      services: 'Candid photo team, 4K video teaser, drone footage, coffee table photobooks',
      notes: 'Includes pre-wedding photoshoot at Jal Mahal.',
      isSample: true
    },
    // Birthday Vendors
    {
      id: 'ven-b-1',
      eventId: 'event-birthday-02',
      name: 'Skyline Terrace & Taproom',
      category: 'Venues',
      contactPerson: 'Aditi Nair',
      phone: '+91 99000 67890',
      email: 'bookings@skylineterraceblr.com',
      quotedPrice: 65000,
      agreedPrice: 60000,
      paymentStatus: 'Paid',
      bookingStatus: 'Booked',
      rating: 4.8,
      services: 'Rooftop private deck, sound system, bar setup, cleanup crew',
      notes: 'Indoor section available in case of drizzle.',
      isSample: true
    },
    {
      id: 'ven-b-2',
      eventId: 'event-birthday-02',
      name: 'Retro Arcade Labs Rentals',
      category: 'DJs and entertainers',
      contactPerson: 'Rishi Mohan',
      phone: '+91 98860 11223',
      email: 'support@retroarcadelabs.io',
      quotedPrice: 22000,
      agreedPrice: 20000,
      paymentStatus: 'Unpaid',
      bookingStatus: 'Booked',
      rating: 4.6,
      services: '2 multi-game retro arcade cabinets with 3000+ classic games, LED screen',
      notes: 'Technician on-site throughout the party.',
      isSample: true
    }
  ];

  return {
    users: [
      {
        id: demoUserId,
        email: 'demo@eventease.ai',
        name: 'Demo Planner',
        password: demoHashedPassword,
        role: 'user',
        currency: 'INR',
        createdAt: '2026-10-20T00:00:00.000Z'
      }
    ],
    events: defaultEvents,
    expenses: defaultExpenses,
    tasks: defaultTasks,
    vendors: defaultVendors,
    ideas: []
  };
};

class LocalDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (e) {
      console.warn('Failed reading db.json, generating fresh seed:', e.message);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }
  }

  // Users
  getUsers() { return this.data.users || []; }
  findUserByEmail(email) {
    return (this.data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return (this.data.users || []).find(u => u.id === id);
  }
  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Events
  getEventsByUser(userId) {
    return (this.data.events || []).filter(e => e.userId === userId);
  }
  getEventById(id, userId) {
    const event = (this.data.events || []).find(e => e.id === id);
    if (!event) return null;
    if (userId && event.userId !== userId) return null;
    return event;
  }
  addEvent(event) {
    this.data.events.push(event);
    this.save();
    return event;
  }
  updateEvent(id, updates, userId) {
    const idx = this.data.events.findIndex(e => e.id === id && (!userId || e.userId === userId));
    if (idx === -1) return null;
    this.data.events[idx] = { ...this.data.events[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.events[idx];
  }
  deleteEvent(id, userId) {
    const idx = this.data.events.findIndex(e => e.id === id && (!userId || e.userId === userId));
    if (idx === -1) return false;
    this.data.events.splice(idx, 1);
    // Cascade delete associated tasks, expenses, vendors
    this.data.tasks = this.data.tasks.filter(t => t.eventId !== id);
    this.data.expenses = this.data.expenses.filter(ex => ex.eventId !== id);
    this.data.vendors = this.data.vendors.filter(v => v.eventId !== id);
    this.save();
    return true;
  }

  // Expenses
  getExpenses(eventId) {
    return (this.data.expenses || []).filter(ex => ex.eventId === eventId);
  }
  addExpense(expense) {
    this.data.expenses.push(expense);
    this.save();
    return expense;
  }
  updateExpense(id, updates) {
    const idx = this.data.expenses.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.expenses[idx] = { ...this.data.expenses[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.expenses[idx];
  }
  deleteExpense(id) {
    const idx = this.data.expenses.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.expenses.splice(idx, 1);
    this.save();
    return true;
  }

  // Tasks
  getTasks(eventId) {
    return (this.data.tasks || []).filter(t => t.eventId === eventId);
  }
  addTask(task) {
    this.data.tasks.push(task);
    this.save();
    return task;
  }
  updateTask(id, updates) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.tasks[idx] = { ...this.data.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.tasks[idx];
  }
  deleteTask(id) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.data.tasks.splice(idx, 1);
    this.save();
    return true;
  }

  // Vendors
  getVendors(eventId) {
    return (this.data.vendors || []).filter(v => v.eventId === eventId);
  }
  addVendor(vendor) {
    this.data.vendors.push(vendor);
    this.save();
    return vendor;
  }
  updateVendor(id, updates) {
    const idx = this.data.vendors.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.vendors[idx] = { ...this.data.vendors[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.vendors[idx];
  }
  deleteVendor(id) {
    const idx = this.data.vendors.findIndex(v => v.id === id);
    if (idx === -1) return false;
    this.data.vendors.splice(idx, 1);
    this.save();
    return true;
  }

  // Saved Ideas
  getIdeas(eventId) {
    return (this.data.ideas || []).filter(i => i.eventId === eventId);
  }
  addIdea(idea) {
    if (!this.data.ideas) this.data.ideas = [];
    this.data.ideas.push(idea);
    this.save();
    return idea;
  }
  deleteIdea(id) {
    if (!this.data.ideas) return false;
    const idx = this.data.ideas.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.data.ideas.splice(idx, 1);
    this.save();
    return true;
  }
}

export const db = new LocalDatabase();
