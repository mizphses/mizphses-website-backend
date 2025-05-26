import { createId } from "@paralleldrive/cuid2";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/prisma/client";

export class PublishService {
  private prisma: PrismaClient;

  constructor(db: D1Database) {
    const adapter = new PrismaD1(db);
    this.prisma = new PrismaClient({ adapter });
  }

  async createPublishKey(name: string) {
    const publishKey = await this.prisma.apiKeys.create({
      data: {
        name,
        key: createId(),
      },
    });
    return publishKey;
  }

  async getPublishKeyList() {
    const publishKey = await this.prisma.apiKeys.findMany();
    return publishKey;
  }

  async deletePublishKey(id: string) {
    await this.prisma.apiKeys.delete({
      where: { id },
    });

    const publishKey = await this.prisma.apiKeys.findMany();
    return publishKey;
  }
}
