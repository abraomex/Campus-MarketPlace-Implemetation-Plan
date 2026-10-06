import { PrismaClient, ItemCondition, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Categories
  const categoriesData = [
    { name: "Textbooks & Course Materials", slug: "textbooks", icon: "book-open" },
    { name: "Electronics & Tech", slug: "electronics", icon: "laptop" },
    { name: "Dorm & Furniture", slug: "dorm-furniture", icon: "bed" },
    { name: "Clothing & Campus Gear", slug: "clothing", icon: "shirt" },
    { name: "Bikes & Transport", slug: "bikes", icon: "bike" },
    { name: "School & Lab Supplies", slug: "supplies", icon: "pen-tool" },
    { name: "Other", slug: "other", icon: "package" },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log(`✅ Seeded ${categories.length} categories.`);

  // 2. Seed Test Users
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
      bio: "Junior studying Computer Science. Selling old gear before semester starts!",
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
      bio: "Sophomore studying Biology. Pre-med student with textbooks to pass on.",
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

  console.log("✅ Seeded test users (student1, student2, admin). Password: password123");

  // 3. Seed Sample Products
  const textbooksCat = categories.find((c) => c.slug === "textbooks")!;
  const electronicsCat = categories.find((c) => c.slug === "electronics")!;
  const dormCat = categories.find((c) => c.slug === "dorm-furniture")!;
  const transportCat = categories.find((c) => c.slug === "bikes")!;

  const sampleProducts = [
    {
      title: "Calculus: Early Transcendentals (8th Edition)",
      description: "Hardcover in great condition! No highlighting, clean pages. Used for MATH 101/102. Can meet near the library.",
      price: 45.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Main Library lobby",
      categoryId: textbooksCat.id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "TI-84 Plus CE Graphing Calculator",
      description: "Mint condition rose gold TI-84 Plus CE with charging cable and protective cover. Needed for stats & calc.",
      price: 70.0,
      condition: ItemCondition.LIKE_NEW,
      status: ProductStatus.AVAILABLE,
      location: "Science Quad",
      categoryId: electronicsCat.id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Dell 24\" IPS 1080p Monitor with HDMI Cable",
      description: "Great second monitor for dorm desk setup. 75Hz refresh rate, includes power adapter and HDMI cable.",
      price: 65.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "North Dorms Tower B",
      categoryId: electronicsCat.id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Target Mini Fridge with Freezer Compartment",
      description: "Compact 3.2 cu ft mini fridge. Super quiet, works great, thoroughly cleaned and sanitized.",
      price: 50.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "South Campus Commons",
      categoryId: dormCat.id,
      sellerId: student2.id,
      images: [
        "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Trek Hybrid Commuter Bike (Medium Frame)",
      description: "Ready to ride across campus! 21-speed gears, brand new brake pads, comes with Kryptonite U-lock and key.",
      price: 120.0,
      condition: ItemCondition.GOOD,
      status: ProductStatus.AVAILABLE,
      location: "Student Union Bike Rack",
      categoryId: transportCat.id,
      sellerId: student1.id,
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

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
    }
  }

  console.log(`✅ Seeded sample marketplace products.`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

