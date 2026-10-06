import http from "http";
import app from "./src/server";

const PORT = 5001; // Test port

function request(options: {
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
}): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const data = options.body ? JSON.stringify(options.body) : undefined;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: PORT,
        path: options.path,
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
          ...options.headers,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let parsed = raw;
          try {
            parsed = JSON.parse(raw);
          } catch {}
          resolve({ status: res.statusCode || 500, body: parsed });
        });
      }
    );

    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`\n🧪 Test server running on http://127.0.0.1:${PORT}\n`);

    try {
      // 1. Health check
      console.log("1. Testing GET /api/health...");
      const health = await request({ method: "GET", path: "/api/health" });
      console.log("Status:", health.status, health.body);
      if (health.status !== 200) throw new Error("Health check failed");

      // 2. Categories
      console.log("\n2. Testing GET /api/products/categories...");
      const cats = await request({ method: "GET", path: "/api/products/categories" });
      console.log("Status:", cats.status, "Count:", cats.body.data?.length);
      if (cats.status !== 200 || !cats.body.data?.length) throw new Error("Categories failed");
      const categoryId = cats.body.data[0].id;

      // 3. Products List & Search
      console.log("\n3. Testing GET /api/products...");
      const list = await request({ method: "GET", path: "/api/products?page=1&limit=5" });
      console.log("Status:", list.status, "Products returned:", list.body.data?.length, "Total:", list.body.meta?.total);
      if (list.status !== 200 || !list.body.data?.length) throw new Error("Product listing failed");
      const firstProductId = list.body.data[0].id;

      // 4. Product Details
      console.log(`\n4. Testing GET /api/products/${firstProductId}...`);
      const detail = await request({ method: "GET", path: `/api/products/${firstProductId}` });
      console.log("Status:", detail.status, "Title:", detail.body.data?.title);
      if (detail.status !== 200) throw new Error("Product detail failed");

      // 5. Auth Login
      console.log("\n5. Testing POST /api/auth/login...");
      const login = await request({
        method: "POST",
        path: "/api/auth/login",
        body: { email: "alex@university.edu", password: "password123" },
      });
      console.log("Status:", login.status, "User:", login.body.data?.user?.name);
      if (login.status !== 200 || !login.body.data?.token) throw new Error("Login failed");
      const alexToken = login.body.data.token;

      // 6. Auth Register new user
      console.log("\n6. Testing POST /api/auth/register...");
      const rand = Math.floor(Math.random() * 10000);
      const register = await request({
        method: "POST",
        path: "/api/auth/register",
        body: {
          name: `Student Tester ${rand}`,
          email: `student${rand}@university.edu`,
          password: "password123",
          campus: "East Quad",
        },
      });
      console.log("Status:", register.status, "New User:", register.body.data?.user?.email);
      if (register.status !== 201 || !register.body.data?.token) throw new Error("Registration failed");
      const newStudentToken = register.body.data.token;

      // 7. Protected GET /api/auth/me
      console.log("\n7. Testing GET /api/auth/me (Protected route)...");
      const me = await request({
        method: "GET",
        path: "/api/auth/me",
        headers: { Authorization: `Bearer ${newStudentToken}` },
      });
      console.log("Status:", me.status, "Authenticated Profile:", me.body.data?.email);
      if (me.status !== 200) throw new Error("Auth me failed");

      // 8. Create Product (Protected POST /api/products)
      console.log("\n8. Testing POST /api/products (Create Listing)...");
      const newProduct = await request({
        method: "POST",
        path: "/api/products",
        headers: { Authorization: `Bearer ${newStudentToken}` },
        body: {
          title: "Organic Chemistry Model Kit (Molymod)",
          description: "Complete 3D molecular model kit for organic chem lab. All pieces intact with box.",
          price: 25.0,
          condition: "LIKE_NEW",
          location: "Chemistry Building Room 104",
          categoryId: categoryId,
          imageUrls: ["https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"],
        },
      });
      console.log("Status:", newProduct.status, "Created Product ID:", newProduct.body.data?.id);
      if (newProduct.status !== 201) throw new Error("Create product failed: " + JSON.stringify(newProduct.body));
      const createdId = newProduct.body.data.id;

      // 9. Update Product (Protected PUT /api/products/:id)
      console.log(`\n9. Testing PUT /api/products/${createdId}...`);
      const updated = await request({
        method: "PUT",
        path: `/api/products/${createdId}`,
        headers: { Authorization: `Bearer ${newStudentToken}` },
        body: {
          price: 20.0,
          title: "Organic Chemistry Model Kit (Molymod) - Price Drop!",
        },
      });
      console.log("Status:", updated.status, "New Price:", updated.body.data?.price, "New Title:", updated.body.data?.title);
      if (updated.status !== 200) throw new Error("Update product failed");

      // 10. Security: Attempt unauthorized edit by Alex on New Student's listing
      console.log(`\n10. Testing Unauthorized Update (Alex trying to edit New Student's product)...`);
      const unauthEdit = await request({
        method: "PUT",
        path: `/api/products/${createdId}`,
        headers: { Authorization: `Bearer ${alexToken}` },
        body: { price: 5.0 },
      });
      console.log("Status:", unauthEdit.status, "(Expected 403 Forbidden)");
      if (unauthEdit.status !== 403) throw new Error("Security check failed: Unauthorized user was able to edit!");

      // 11. Delete Product (Protected DELETE /api/products/:id)
      console.log(`\n11. Testing DELETE /api/products/${createdId}...`);
      const deleted = await request({
        method: "DELETE",
        path: `/api/products/${createdId}`,
        headers: { Authorization: `Bearer ${newStudentToken}` },
      });
      console.log("Status:", deleted.status, deleted.body.data?.message);
      if (deleted.status !== 200) throw new Error("Delete product failed");

      console.log("\n=======================================================");
      console.log("🎉 ALL STAGE 1 ENDPOINTS VERIFIED & WORKING PERFECTLY!");
      console.log("=======================================================\n");
    } catch (e) {
      console.error("\n❌ Test execution failed:", e);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTests();

