import { PrismaClient, ItemCondition, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding rich campus marketplace database...");

  // 1. Seed Categories (including Campus Shows & Events!)
  const categoriesData = [
    { name: "Shows, Events & Tickets", slug: "shows-events", icon: "ticket" },
    { name: "Textbooks & Course Materials", slug: "textbooks", icon: "book-open" },
    { name: "Electronics & Tech", slug: "electronics", icon: "laptop" },
    { name: "Dorm & Furniture", slug: "dorm-furniture", icon: "bed" },
    { name: "Clothing & Campus Gear", slug: "clothing", icon: "shirt" },
    { name: "Bikes & Transport", slug: "bikes", icon: "bike" },
    { name: "School & Lab Supplies", slug: "supplies", icon: "pen-tool" },
    { name: "Other", slug: "other", icon: "package" },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
    categories[cat.slug] = category;
  }
  console.log(`✅ Seeded ${Object.keys(categories).length} categories.`);

  // 2. Seed Test Student Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const student1 = await prisma.user.upsert({
    where: { email: "alex@university.edu" },
    update: {},
    create: {
      name: "Alex Rivera",
      email: "alex@university.edu",
      passwordHash,
      campus: "North Campus Dorms",
      phone: "555-0101",
      bio: "Junior CS major. Selling tech, event passes, and old engineering books.",
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "sarah@university.edu" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "sarah@university.edu",
      passwordHash,
      campus: "West Campus Apartments",
      phone: "555-0102",
      bio: "Sophomore Pre-Med & Biology student. Lots of science books and dorm essentials.",
      role: "STUDENT",
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "marcus@university.edu" },
    update: {},
    create: {
      name: "Marcus Brody",
      email: "marcus@university.edu",
      passwordHash,
      campus: "South Quad Towers",
      phone: "555-0103",
      bio: "Senior Business student. Downsizing dorm furniture and concert tickets.",
      role: "STUDENT",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@university.edu" },
    update: {},
    create: {
      name: "Campus Admin",
      email: "admin@university.edu",
      passwordHash,
      campus: "Student Life Center",
      role: "ADMIN",
    },
  });

  console.log("✅ Seeded test users (Alex, Sarah, Marcus, Admin). Password: password123");

  // 3. Rich Catalog of Products (25+ realistic items across all categories)
  const sampleProducts = [
    // --- Shows & Events / Tickets ---
    {
      title: "2x Campus Spring Music Fest VIP Wristbands",
      description: "Can't make it to this Saturday's Spring Fest due to midterms. 2 wristbands for the main stage, food trucks, and front pit area. Selling at student early-bird cost!",
      price: 45.0,
      condition: ItemCondition.NEW,
      status: ProductStatus.AVAILABLE,
      location: "Student Union Desk",
      categoryId: categories["shows-events"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Homecoming Rivalry Football Game — Student Section Ticket",
      description: "Section 104, Row 12 (Right behind the student marching band). Mobile transfer via student portal or meet on campus to verify.",
      price: 25.0,
      condition: ItemCondition.NEW,
      status: ProductStatus.AVAILABLE,
      location: "Campus Stadium Gate B",
      categoryId: categories["shows-events"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Campus Drama Society: Hamlet Opening Night Tickets (Pair)",
      description: "Two prime center orchestra seats for Friday night's theater department performance in the Fine Arts Auditorium. Includes program booklets.",
      price: 18.0,
      condition: ItemCondition.NEW,
      status: ProductStatus.AVAILABLE,
      location: "Fine Arts Center Lobby",
      categoryId: categories["shows-events"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Campus Comedy Night Showcase — 2 Table Seats with Drink Vouchers",
      description: "Student Union Ballroom this Thursday 8 PM. Featuring visiting guest comedians and campus comedy troupe. Great for a fun date night!",
      price: 14.0,
      condition: ItemCondition.NEW,
      status: ProductStatus.AVAILABLE,
      location: "Student Union 2nd Floor",
      categoryId: categories["shows-events"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- Textbooks ---
    {
      title: "Calculus: Early Transcendentals (8th Edition)",
      description: "Hardcover in great condition! Clean pages, no highlighting. Used for MATH 101/102. Can meet near the science library.",
      price: 45.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Science Library",
      categoryId: categories["textbooks"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Campbell Biology (12th Edition) Hardcover",
      description: "Comprehensive biology textbook for BIO 110 & 120. Minimal notes in margins, binding is tight and sturdy. Save $120 over bookstore retail.",
      price: 60.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Life Sciences Bldg",
      categoryId: categories["textbooks"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1532012164546-f432f2e37257?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Introduction to Algorithms (CLRS 3rd Edition)",
      description: "The classic MIT Press algorithms textbook. Perfect for CS 201/301. Excellent condition with plastic protective book jacket.",
      price: 50.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Engineering Quad Room 102",
      categoryId: categories["textbooks"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Principles of Microeconomics (Mankiw 9th Edition)",
      description: "Standard economics course book. Very clean condition, includes review summary sheets I made for the final exam.",
      price: 35.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Business School Atrium",
      categoryId: categories["textbooks"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- Electronics & Tech ---
    {
      title: "TI-84 Plus CE Color Graphing Calculator",
      description: "Mint condition rose gold TI-84 Plus CE with charging cable, slide cover, and fresh battery life. Essential for calculus, physics, and stats exams.",
      price: 70.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Math Building lobby",
      categoryId: categories["electronics"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Apple iPad Air (4th Gen) 64GB Space Gray + Apple Pencil 2",
      description: "Flawless screen with matte paper-like screen protector applied. Includes magnetic Apple Pencil 2 and smart folio case. Battery health 93%.",
      price: 320.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Library Cafe",
      categoryId: categories["electronics"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Sony WH-1000XM4 Wireless Noise-Cancelling Headphones",
      description: "Must-have for studying in noisy dorms or crowded libraries. In pristine condition with original travel case, 3.5mm cable, and USB-C cord.",
      price: 140.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Main Library 3rd Floor",
      categoryId: categories["electronics"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Dell 24\" IPS 1080p Monitor with HDMI Cable",
      description: "Great second screen for laptops. 75Hz refresh rate, thin bezels, includes power adapter and high-speed HDMI cable.",
      price: 65.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "North Dorms Tower B",
      categoryId: categories["electronics"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Logitech MX Master 3S Wireless Mouse (Graphite)",
      description: "Silent clicks, 8K DPI sensor that works on dorm desks without a mousepad, USB-C fast charging. Works seamlessly with Mac & Windows.",
      price: 50.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Computer Lab 4",
      categoryId: categories["electronics"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- Dorm & Furniture ---
    {
      title: "Target Mini Fridge with Separate Freezer (3.2 cu ft)",
      description: "Whisper-quiet compressor, keeps drinks ice cold. Cleaned and sanitized inside and out. Moving into an apartment with full fridge so no longer needed.",
      price: 55.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "South Campus Commons",
      categoryId: categories["dorm-furniture"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Keurig K-Mini Single Serve Coffee Maker (Oasis Teal)",
      description: "Compact single cup coffee maker that fits on any dorm desk. Brews 6 to 12 oz cups in under 2 minutes. Includes box of 12 K-cups!",
      price: 30.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "West Quad Dorm Hall",
      categoryId: categories["dorm-furniture"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "IKEA Desk Lamp with Wireless Qi Smartphone Charger",
      description: "Modern minimalist desk lamp with 3 color temperature modes and dimming. Base has a built-in wireless phone charger. Super convenient for studying.",
      price: 22.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "North Dorms",
      categoryId: categories["dorm-furniture"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Comfortable Ergonomic Mesh Swivel Chair",
      description: "Breathable mesh back with adjustable lumbar support and flip-up armrests. Way better than standard dorm wooden chairs.",
      price: 45.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "South Quad Dorms",
      categoryId: categories["dorm-furniture"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1580481077195-c328ad4f4f79?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- Clothing & Campus Gear ---
    {
      title: "Official University Embroidered Champion Hoodie (Size L)",
      description: "Heavyweight reverse-weave Champion fleece hoodie in university navy. Barely worn, super warm for chilly campus morning walks.",
      price: 28.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Bookstore Plaza",
      categoryId: categories["clothing"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "The North Face Resolve 2 Waterproof Rain Jacket (Size M)",
      description: "DryVent waterproof and breathable jacket with stowable hood. Essential for walking across campus in rainy weather.",
      price: 48.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Student Union",
      categoryId: categories["clothing"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Official Graduation Cap & Gown Set (Height 5'7\" - 5'9\")",
      description: "Bachelor's degree black cap and gown set with college tassel. Worn once for 2 hours during commencement ceremony.",
      price: 25.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Student Union Atrium",
      categoryId: categories["clothing"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- Bikes & Transport ---
    {
      title: "Trek FX 2 Hybrid Commuter Bike (Medium Frame)",
      description: "Tuned up and ready to ride across campus! 24-speed Shimano gears, lightweight aluminum frame, includes Kryptonite U-lock and key.",
      price: 135.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Student Union Bike Rack",
      categoryId: categories["bikes"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Segway Ninebot KickScooter E2 Plus (15.5 mph)",
      description: "Electric scooter with front electronic brake and rear drum brake, puncture-proof 8.1\" tires, front headlight. Folds easily to bring into lecture halls.",
      price: 175.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Engineering Quad",
      categoryId: categories["bikes"].id,
      sellerId: student3.id,
      images: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Sector 9 Bamboo Cruiser Longboard",
      description: "Smooth carving longboard with Gullwing Charger trucks and 70mm butterball wheels. Great for coasting between campus classes.",
      price: 55.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Central Quad Lawn",
      categoryId: categories["bikes"].id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // --- School & Lab Supplies ---
    {
      title: "Organic Chemistry Molecular Model Kit (Molymod 120 Pcs)",
      description: "Essential for visualizing 3D organic stereochemistry, chair conformations, and Newman projections. All atoms and bond links complete in sturdy case.",
      price: 20.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Chemistry Building Room 104",
      categoryId: categories["supplies"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lab Coat (Unisex Size M, 100% Cotton) + Anti-Fog Splash Goggles",
      description: "Required for general chem and organic chem labs. Clean and undamaged, meets OSHA and university safety standards.",
      price: 18.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Science Complex 1st Fl",
      categoryId: categories["supplies"].id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  let addedCount = 0;
  for (const item of sampleProducts) {
    const { images, ...productData } = item;
    const existing = await prisma.product.findFirst({
      where: { title: productData.title, sellerId: productData.sellerId },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          ...productData,
          images: {
            create: images.map((url, i) => ({
              url,
              isPrimary: i === 0,
            })),
          },
        },
      });
      addedCount++;
    }
  }

  console.log(`✅ Seeded ${addedCount} new marketplace listings (including Shows & Event tickets)!`);
  console.log("🎉 Complete seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
