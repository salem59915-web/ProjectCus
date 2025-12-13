import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";

describe("Admin CRUD Operations", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  describe("Models CRUD", () => {
    it("should fetch all models", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const models = await caller.models.getAll();
      expect(Array.isArray(models)).toBe(true);
    });

    it("should create a new model", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const result = await caller.models.create({
        name: "Test Model",
        age: 25,
        gender: "male",
        bio: "Test bio",
        height: 180,
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe("Content Creators CRUD", () => {
    it("should fetch all content creators", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const creators = await caller.contentCreators.getAll();
      expect(Array.isArray(creators)).toBe(true);
    });

    it("should create a new content creator", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const result = await caller.contentCreators.create({
        name: "Test Creator",
        bio: "Test bio",
        platforms: '["instagram","youtube"]',
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe("Video Productions CRUD", () => {
    it("should fetch all video productions", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const videos = await caller.videoProductions.getAll();
      expect(Array.isArray(videos)).toBe(true);
    });

    it("should create a new video production", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const result = await caller.videoProductions.create({
        title: "Test Video",
        description: "Test description",
        videoUrl: "https://example.com/video.mp4",
        productionType: "commercial",
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe("Voice Artists CRUD", () => {
    it("should fetch all voice artists", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const artists = await caller.voiceArtists.getAll();
      expect(Array.isArray(artists)).toBe(true);
    });

    it("should create a new voice artist", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const result = await caller.voiceArtists.create({
        name: "Test Voice Artist",
        gender: "female",
        bio: "Test bio",
        voiceType: "soft",
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe("Content Writing CRUD", () => {
    it("should fetch all content writing samples", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const samples = await caller.contentWriting.getAll();
      expect(Array.isArray(samples)).toBe(true);
    });

    it("should create a new content writing sample", async () => {
      const caller = appRouter.createCaller({ db } as any);
      const result = await caller.contentWriting.create({
        title: "Test Article",
        description: "Test description",
        contentType: "blog",
        wordCount: 500,
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });
});
