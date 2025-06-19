import request from "supertest";
import path from "path";
import app from "../src/app";

describe("POST /incidents (single image upload)", () => {
  it("should upload one image and create a new incident", async () => {
    const res = await request(app)
      .post("/incidents")
      .field("title", "Test image upload")
      .field("description", "Testing upload of one image")
      .field("reportedBy", "z123")
      .field("workplaceId", "x123")
      .field("riskLevel", "High")
      .field("status", "Open")
      .attach("photo", path.join(__dirname, "test-image.jpg"));

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("photoPath");
    expect(typeof res.body.photoPath).toBe("string");
  });
});