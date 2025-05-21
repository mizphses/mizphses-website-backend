import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/prisma/client";
import type { Article } from "../generated/prisma/client";
import { createId } from "@paralleldrive/cuid2";
export class ContentsService {
  private prisma: PrismaClient;

  constructor(db: D1Database) {
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter });
  }

  async createContent(
    title: string,
    text: string,
    description: string,
    ogpImageUrl: string,
    tags: { name: string; slug: string }[],
    publishKeys: string[]
  ): Promise<Article> {
    const content = await this.prisma.article.create({
      data: {
        title,
        content: text,
        description: description,
        ogpImage: ogpImageUrl,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { slug: tag.slug },
            create: { slug: tag.slug, name: tag.name },
          })),
        },
        publishKeys: {
          connect: publishKeys.map((key) => ({ id: key })),
        },
      },
    });
    return content;
  }

  async getContentList(): Promise<
    Array<{
      id: string;
      title: string;
      description: string | null;
      ogpImage: string | null;
      tags: { name: string; slug: string }[];
      publishKeys: { name: string; key: string }[];
    }>
  > {
    const contents = await this.prisma.article.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        ogpImage: true,
        tags: {
          select: { name: true, slug: true },
        },
        publishKeys: {
          select: { name: true, key: true },
        },
      },
    });
    return contents;
  }

  async getContent(id: string): Promise<Article> {
    const content = await this.prisma.article.findUnique({
      where: { id },
    });
    if (!content) {
      throw new Error("Content not found");
    }
    return content;
  }
  async uploadNonTextAsset(file: File, bucket: R2Bucket): Promise<string> {
    const key = createId();
    await bucket.put(key, file);
    return key;
  }
}
