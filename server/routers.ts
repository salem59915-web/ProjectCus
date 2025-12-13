import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getModels,
  getContentCreators,
  getVideoProductions,
  getVoiceArtists,
  getContentWritingSamples,
} from "./db-models";
import { getDb } from "./db";
import { models, contentCreators, videoProductions, voiceArtists, contentWriting, banners } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  models: router({
    list: publicProcedure
      .input(
        z.object({
          gender: z.string().optional(),
          minAge: z.number().optional(),
          maxAge: z.number().optional(),
          specialty: z.string().optional(),
        })
      )
      .query(({ input }) => getModels(input)),
    
    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(models).orderBy(models.createdAt);
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          age: z.number(),
          gender: z.enum(["male", "female"]),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          videoUrl: z.string().optional(),
          height: z.number().optional(),
          experience: z.string().optional(),
          specialties: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(models).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          age: z.number().optional(),
          gender: z.enum(["male", "female"]).optional(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          videoUrl: z.string().optional(),
          height: z.number().optional(),
          experience: z.string().optional(),
          specialties: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(models).set(data).where(eq(models.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(models).where(eq(models.id, input.id));
        return { success: true };
      }),
  }),

  contentCreators: router({
    list: publicProcedure
      .input(
        z.object({
          platform: z.string().optional(),
          contentType: z.string().optional(),
        })
      )
      .query(({ input }) => getContentCreators(input)),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(contentCreators).orderBy(contentCreators.createdAt);
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          portfolioUrl: z.string().optional(),
          platforms: z.string().optional(),
          contentTypes: z.string().optional(),
          sampleWorks: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(contentCreators).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          portfolioUrl: z.string().optional(),
          platforms: z.string().optional(),
          contentTypes: z.string().optional(),
          sampleWorks: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(contentCreators).set(data).where(eq(contentCreators.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(contentCreators).where(eq(contentCreators.id, input.id));
        return { success: true };
      }),
  }),

  videoProductions: router({
    list: publicProcedure
      .input(
        z.object({
          productionType: z.string().optional(),
        })
      )
      .query(({ input }) => getVideoProductions(input)),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(videoProductions).orderBy(videoProductions.createdAt);
    }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          videoUrl: z.string(),
          thumbnailUrl: z.string().optional(),
          productionType: z.string().optional(),
          clientName: z.string().optional(),
          duration: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(videoProductions).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          videoUrl: z.string().optional(),
          thumbnailUrl: z.string().optional(),
          productionType: z.string().optional(),
          clientName: z.string().optional(),
          duration: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(videoProductions).set(data).where(eq(videoProductions.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(videoProductions).where(eq(videoProductions.id, input.id));
        return { success: true };
      }),
  }),

  voiceArtists: router({
    list: publicProcedure
      .input(
        z.object({
          gender: z.string().optional(),
          voiceType: z.string().optional(),
          language: z.string().optional(),
        })
      )
      .query(({ input }) => getVoiceArtists(input)),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(voiceArtists).orderBy(voiceArtists.createdAt);
    }),

    create: publicProcedure
      .input(
        z.object({
          name: z.string(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          gender: z.enum(["male", "female"]),
          voiceType: z.string().optional(),
          languages: z.string().optional(),
          accents: z.string().optional(),
          sampleAudios: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(voiceArtists).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          bio: z.string().optional(),
          profileImage: z.string().optional(),
          gender: z.enum(["male", "female"]).optional(),
          voiceType: z.string().optional(),
          languages: z.string().optional(),
          accents: z.string().optional(),
          sampleAudios: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(voiceArtists).set(data).where(eq(voiceArtists.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(voiceArtists).where(eq(voiceArtists.id, input.id));
        return { success: true };
      }),
  }),

  contentWriting: router({
    list: publicProcedure
      .input(
        z.object({
          contentType: z.string().optional(),
        })
      )
      .query(({ input }) => getContentWritingSamples(input)),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(contentWriting).orderBy(contentWriting.createdAt);
    }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          contentType: z.string().optional(),
          sampleText: z.string().optional(),
          clientName: z.string().optional(),
          wordCount: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(contentWriting).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          contentType: z.string().optional(),
          sampleText: z.string().optional(),
          clientName: z.string().optional(),
          wordCount: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(contentWriting).set(data).where(eq(contentWriting.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(contentWriting).where(eq(contentWriting.id, input.id));
        return { success: true };
      }),
  }),

  banners: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(banners).where(eq(banners.isActive, 1)).orderBy(banners.position);
    }),

    getAll: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(banners).orderBy(banners.position);
    }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          imageUrl: z.string(),
          link: z.string().optional(),
          position: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(banners).values(input);
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          link: z.string().optional(),
          position: z.number().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...data } = input;
        await db.update(banners).set(data).where(eq(banners.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(banners).where(eq(banners.id, input.id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
