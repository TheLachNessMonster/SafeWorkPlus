import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";
import app from "../backend/app";
import mongoose from "mongoose";

// Emulate __dirname in ESM environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("POST /incidents (single image upload)", () => {
  it("should upload one image and create a new incident", async () => {
    const res = await request(app)
      .post("/incidents")
      .field("title", "Test image upload")
      .field("description", "Testing upload of one image")
      .field("reportedBy", "64bfc3ef13a3c1e2f0d12345")
      .field("workplaceId", "64bfc3ef13a3c1e2f0d12346")
      .field("riskLevel", "High")
      .field("status", "Open")
      .attach("photo", path.join(__dirname, "test-image.jpg"));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("photoPath");
    expect(typeof res.body.photoPath).toBe("string");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

