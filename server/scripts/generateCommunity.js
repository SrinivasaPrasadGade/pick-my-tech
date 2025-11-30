// Generate 100+ community discussion posts
const generateCommunityPosts = (userId, deviceIds) => {
  const posts = [];

  const discussionTemplates = [
    // Reviews (20)
    { title: 'iPhone 15 Pro Max - 6 Month Review: Worth the Upgrade?', category: 'review', content: 'I\'ve been using the iPhone 15 Pro Max for 6 months now and here\'s my honest review. The A17 Pro chip is incredibly fast, battery life is excellent, and the camera system is outstanding. However, the price tag is steep. What do you think?', tags: ['iPhone', 'Apple', 'Review'] },
    { title: 'Samsung Galaxy S24 Ultra Camera Test: Real-World Results', category: 'review', content: 'Took the Galaxy S24 Ultra on a photography trip. The 200MP camera is impressive in daylight, but low-light performance could be better. The zoom capabilities are mind-blowing though!', tags: ['Samsung', 'Camera', 'Photography'] },
    { title: 'MacBook Pro M3 Pro Review: Best Laptop for Developers?', category: 'review', content: 'As a software developer, I\'ve been using the M3 Pro MacBook Pro for 3 months. The performance is incredible, battery lasts all day, but macOS has some quirks compared to Linux.', tags: ['MacBook', 'Apple', 'Development'] },
    { title: 'Google Pixel 8 Pro: Best Android Camera?', category: 'review', content: 'The Pixel 8 Pro camera consistently produces amazing photos. The AI features are helpful, though sometimes a bit aggressive. Night mode is the best I\'ve seen.', tags: ['Google', 'Pixel', 'Camera'] },
    { title: 'Dell XPS 15 vs MacBook Pro 16: Which Should You Buy?', category: 'review', content: 'I\'ve used both extensively. Dell XPS 15 has better value, MacBook Pro has better battery and ecosystem. Windows 11 vs macOS is the real deciding factor.', tags: ['Dell', 'MacBook', 'Comparison'] },

    // Questions (25)
    { title: 'Should I buy iPhone 15 Pro or wait for iPhone 16?', category: 'question', content: 'My iPhone 12 is getting old. Should I upgrade to iPhone 15 Pro now or wait for iPhone 16? What are your thoughts?', tags: ['iPhone', 'Apple', 'Question'] },
    { title: 'Best Gaming Laptop Under $1500 in 2024?', category: 'question', content: 'Looking for a gaming laptop that can handle AAA games at 1080p. Any recommendations under $1500? Considering MSI, ASUS, or Lenovo.', tags: ['Gaming', 'Laptop', 'Recommendation'] },
    { title: 'Is the iPad Pro worth it for students?', category: 'question', content: 'College student here. Thinking about getting iPad Pro for note-taking and studying. Is it worth the price or should I go with regular iPad?', tags: ['iPad', 'Apple', 'Education'] },
    { title: 'Galaxy Watch 6 vs Apple Watch Series 9: Which is better?', category: 'question', content: 'I have an Android phone but considering Apple Watch. Should I stick with Galaxy Watch 6 or switch to iPhone + Apple Watch?', tags: ['Smartwatch', 'Samsung', 'Apple'] },
    { title: 'Do I need 16GB RAM for programming?', category: 'question', content: 'Starting a coding bootcamp. Do I need 16GB RAM or will 8GB be enough? Planning to use VS Code, Docker, and multiple browsers.', tags: ['Laptop', 'Programming', 'Specs'] },

    // Discussions (30)
    { title: 'The Future of Smartphones: What\'s Next After Foldables?', category: 'discussion', content: 'Foldables are cool, but what\'s the next big innovation? Rollable displays? AI-first phones? What do you think will be the next game-changer?', tags: ['Future', 'Innovation', 'Technology'] },
    { title: 'Why Are Laptops Getting More Expensive?', category: 'discussion', content: 'It seems like every year laptops get more expensive. What\'s driving the price increases? Is it inflation, better specs, or something else?', tags: ['Laptops', 'Price', 'Trends'] },
    { title: 'Android vs iOS: Which is Better in 2024?', category: 'discussion', content: 'The eternal debate continues. iOS has better privacy and ecosystem, Android has more customization and options. What\'s your take?', tags: ['Android', 'iOS', 'Comparison'] },
    { title: 'Gaming on Mac: Is It Finally Viable?', category: 'discussion', content: 'With Apple Silicon and game porting toolkit, can Macs finally compete with Windows for gaming? Share your experiences!', tags: ['Mac', 'Gaming', 'Apple Silicon'] },
    { title: 'Battery Life: The Most Important Feature?', category: 'discussion', content: 'Is battery life the most important feature in a device? I\'d rather have great battery than the fastest processor. What about you?', tags: ['Battery', 'Features', 'Discussion'] },

    // Experiences (15)
    { title: 'Switched from iPhone to Samsung: My Experience', category: 'experience', content: 'Used iPhone for 10 years, switched to Galaxy S24 Ultra. The transition was smoother than expected. Some things I miss, some things are better. AMA!', tags: ['iPhone', 'Samsung', 'Switch'] },
    { title: 'Bought My First Gaming Laptop: Here\'s What I Learned', category: 'experience', content: 'First-time gaming laptop buyer here. Learned a lot about cooling, thermal throttling, and why gaming laptops need to be plugged in. Sharing my journey!', tags: ['Gaming', 'Laptop', 'Beginner'] },
    { title: 'iPad Pro Replaced My Laptop for 90% of Tasks', category: 'experience', content: 'Tried using iPad Pro as my main device for a month. Surprisingly, it handled most of my work tasks. Only needed laptop for heavy coding.', tags: ['iPad', 'Productivity', 'Experience'] },

    // Tips (10)
    { title: '10 Tips to Extend Your Phone Battery Life', category: 'tip', content: 'Here are 10 proven tips to make your phone battery last longer: 1) Reduce screen brightness 2) Turn off location services when not needed 3) Close background apps...', tags: ['Battery', 'Tips', 'Optimization'] },
    { title: 'How to Choose the Right Laptop for Your Needs', category: 'tip', content: 'Choosing a laptop can be overwhelming. Here\'s a guide: Identify your primary use case, set a budget, consider portability, check connectivity options, and read reviews!', tags: ['Laptop', 'Guide', 'Tips'] },
  ];

  // Expand templates to 100+ posts by creating variations
  const categories = ['review', 'question', 'discussion', 'experience', 'tip'];
  const devices = ['iPhone', 'Samsung Galaxy', 'MacBook', 'iPad', 'Pixel', 'Dell XPS', 'HP', 'Lenovo', 'ASUS', 'OnePlus'];
  const topics = ['battery', 'camera', 'performance', 'design', 'software', 'price', 'gaming', 'productivity', 'photography', 'AI'];

  // Generate 100+ posts
  for (let i = 0; i < 120; i++) {
    const category = categories[i % categories.length];
    const device = devices[i % devices.length];
    const topic = topics[i % topics.length];

    let title, content;

    if (category === 'review') {
      title = `${device} ${Math.floor(Math.random() * 5) + 10} ${i % 2 === 0 ? 'Review' : 'Long-term Review'}: ${topic.charAt(0).toUpperCase() + topic.slice(1)} Test`;
      content = `I've been testing the ${device} focusing on ${topic}. Here's what I found after ${Math.floor(Math.random() * 6) + 1} months of use. The ${topic} performance is ${['excellent', 'good', 'decent', 'impressive'][i % 4]}. What's your experience?`;
    } else if (category === 'question') {
      title = `${device} vs ${devices[(i + 1) % devices.length]}: Which ${topic} is better?`;
      content = `Looking to buy a new device. Stuck between ${device} and ${devices[(i + 1) % devices.length]}. Specifically interested in ${topic} performance. Any recommendations or experiences to share?`;
    } else if (category === 'discussion') {
      title = `The ${topic} Debate: Is It Overrated or Underrated?`;
      content = `Everyone talks about ${topic} in devices, but is it really that important? Some say it's overrated, others swear by it. What's your take on the ${topic} in modern devices?`;
    } else if (category === 'experience') {
      title = `My Experience Switching to ${device}: ${topic} Edition`;
      content = `Switched from my old device to ${device} primarily for ${topic}. After ${Math.floor(Math.random() * 12) + 1} months, here's my honest experience with the ${topic} and overall device.`;
    } else {
      title = `Top ${Math.floor(Math.random() * 10) + 5} Tips for Better ${topic} on Your Device`;
      content = `Here are my top tips for improving ${topic} on your device. These have worked great for me: 1) Optimize settings 2) Update regularly 3) Use recommended apps 4) Monitor performance...`;
    }

    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Generate mock comments
    const mockComments = [];
    const numComments = Math.floor(Math.random() * 5); // 0-4 comments
    const commentTemplates = [
      "Great post! Thanks for sharing.",
      "I totally agree with you.",
      "This was really helpful, thanks!",
      "I had a different experience, but interesting perspective.",
      "Can you share more details about the battery life?",
      "Does it overheat during gaming?",
      "I'm planning to buy this too.",
      "Wow, didn't know that!",
      "Nice review!",
      "Thanks for the tip."
    ];

    for (let j = 0; j < numComments; j++) {
      mockComments.push({
        user: userId, // Using same test user for simplicity, or could fetch random users
        content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
        createdAt: new Date(createdAt.getTime() + Math.random() * (Date.now() - createdAt.getTime()))
      });
    }

    posts.push({
      user: userId,
      title,
      content,
      category,
      device: deviceIds.length > 0 ? deviceIds[i % deviceIds.length] : undefined,
      tags: [device.split(' ')[0], topic, category],
      likes: [],
      comments: mockComments,
      views: Math.floor(Math.random() * 1000) + 50,
      pinned: i < 5,
      createdAt,
      updatedAt: createdAt
    });
  }

  return posts;
};

module.exports = { generateCommunityPosts };
