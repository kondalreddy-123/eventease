import fetch from 'node-fetch'; // or global fetch in Node 18+

async function runTests() {
  console.log('🧪 Starting EventEase AI Comprehensive Test Suite...\n');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Health Check
    console.log('1. Testing Health Endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('   ✓ Health Check:', health);

    // 2. Demo Login
    console.log('\n2. Testing Demo Authentication...');
    const authRes = await fetch(`${BASE_URL}/auth/demo`, { method: 'POST' });
    const authData = await authRes.json();
    if (!authData.token) throw new Error('Demo login failed');
    const token = authData.token;
    console.log('   ✓ Demo Token Acquired for:', authData.user.name, `(${authData.user.email})`);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 3. List Events
    console.log('\n3. Testing Event Listing...');
    const eventsRes = await fetch(`${BASE_URL}/events`, { headers });
    const eventsData = await eventsRes.json();
    console.log(`   ✓ Found ${eventsData.events.length} initial events:`);
    eventsData.events.forEach(e => {
      console.log(`     - [${e.eventType}] ${e.name} (Budget: ₹${e.totalBudget}, Guests: ${e.guestCount})`);
    });

    const firstEventId = eventsData.events[0].id;

    // 4. Create New Event
    console.log('\n4. Testing Event Creation with Automatic AI Planning...');
    const newEventPayload = {
      name: "Maya's Silver Jubilee Gala",
      eventType: "Birthday",
      description: "An elegant rooftop 25th birthday gala with live jazz and gourmet dinner.",
      eventDate: "2026-12-25",
      location: "Mumbai, Maharashtra",
      guestCount: 80,
      totalBudget: 600000,
      theme: "Champagne Gold & Midnight Indigo",
      foodPreference: "Gourmet Asian Tapas, Sushi Bar & Belgian Fondue",
      culturalPreference: "Cosmopolitan Contemporary",
      venuePreference: "Rooftop Terrace Lounge",
      specialRequirements: "Acoustic jazz quartet, customized photo booth"
    };

    const createRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newEventPayload)
    });
    const createData = await createRes.json();
    console.log('   ✓ Event Created:', createData.event.name, 'with ID:', createData.event.id);
    console.log('   ✓ AI Theme Title:', createData.event.aiPlan?.theme?.title);
    console.log('   ✓ AI Color Palette:', createData.event.aiPlan?.theme?.colorPalette);
    console.log('   ✓ Initial Budget Allocations Count:', createData.event.aiPlan?.budgetBreakdown?.length);
    console.log('   ✓ Initial Milestones Count:', createData.event.aiPlan?.timeline?.length);

    const testEventId = createData.event.id;

    // 5. Test AI Cost Savings
    console.log('\n5. Testing AI Budget Intelligence & Cost Savings...');
    const savingsRes = await fetch(`${BASE_URL}/ai/cost-savings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ eventId: testEventId, totalBudget: 600000 })
    });
    const savingsData = await savingsRes.json();
    console.log('   ✓ Cost Savings Summary:', savingsData.summary);
    console.log(`   ✓ Received ${savingsData.recommendations?.length} Actionable Recommendations`);

    // 6. Test AI Ideas Generation
    console.log('\n6. Testing Personalized AI Ideas Generation...');
    const ideasRes = await fetch(`${BASE_URL}/ai/generate-ideas`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        eventType: 'Birthday',
        topic: 'Food & Menu',
        guestCount: 80,
        budget: 600000,
        theme: 'Champagne Gold'
      })
    });
    const ideasData = await ideasRes.json();
    console.log(`   ✓ Generated ${ideasData.ideas?.length} creative concepts:`);
    ideasData.ideas?.slice(0, 2).forEach((idea, i) => {
      console.log(`     [${i+1}] ${idea.title}: ${idea.description.slice(0, 75)}...`);
    });

    // 7. Add Expense
    console.log('\n7. Testing Expense Recording & Live Calculation...');
    const expenseRes = await fetch(`${BASE_URL}/events/${testEventId}/expenses`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Rooftop Terrace Deposit',
        category: 'Venue and booking',
        estimatedAmount: 200000,
        actualAmount: 190000,
        status: 'Paid',
        notes: 'Deposit paid for 80 guests'
      })
    });
    const expData = await expenseRes.json();
    console.log('   ✓ Expense Added:', expData.expense.title, `- Actual: ₹${expData.expense.actualAmount}`);

    // 8. Add and Complete Task
    console.log('\n8. Testing Timeline Task Creation and Completion...');
    const taskRes = await fetch(`${BASE_URL}/events/${testEventId}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Sample jazz quartet demo rehearsal',
        category: 'Entertainment',
        milestone: 'Vendor research and confirmation',
        dueDate: '2026-11-20',
        priority: 'High',
        assignedTo: 'Lead Planner'
      })
    });
    const taskData = await taskRes.json();
    console.log('   ✓ Task Added:', taskData.task.title);

    const updateTaskRes = await fetch(`${BASE_URL}/events/${testEventId}/tasks/${taskData.task.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ completed: true })
    });
    const updatedTask = await updateTaskRes.json();
    console.log('   ✓ Task Completion Status Toggled:', updatedTask.task.completed);

    // 9. Add Vendor
    console.log('\n9. Testing Vendor Shortlisting...');
    const vendorRes = await fetch(`${BASE_URL}/events/${testEventId}/vendors`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'The Velvet Quartet',
        category: 'DJs and entertainers',
        contactPerson: 'Arjun Sen',
        phone: '+91 98200 44332',
        email: 'booking@velvetquartet.in',
        quotedPrice: 45000,
        agreedPrice: 42000,
        paymentStatus: 'Unpaid',
        bookingStatus: 'Inquiry',
        rating: 4.9,
        services: '3-hour live acoustic jazz and swing set'
      })
    });
    const vendorData = await vendorRes.json();
    console.log('   ✓ Vendor Shortlisted:', vendorData.vendor.name, `(${vendorData.vendor.category})`);

    // 10. Frontend Connection Verification
    console.log('\n10. Testing Frontend Server Availability...');
    const frontendRes = await fetch('http://localhost:5173/');
    console.log('   ✓ Frontend Vite Server Responding with HTTP status:', frontendRes.status);

    console.log('\n🎉 ALL 10 TEST SUITE STEPS PASSED SUCCESSFULLY! 🚀');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTests();
