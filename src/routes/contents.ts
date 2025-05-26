import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { ContentsService } from "../services/contents.service";
import { PublishService } from "../services/publish.service";

const contents = new Hono<{ Bindings: CloudflareBindings }>();

contents.use("*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.TOKEN_KEY,
  });
  await jwtMiddleware(c, next);
});

contents.post("/new", async (c) => {
  const { title, text, description, ogpImageUrl, tags, publishKeys } =
    await c.req.json<{
      title: string;
      text: string;
      description: string;
      ogpImageUrl: string;
      tags: { name: string; slug: string }[];
      publishKeys: string[];
    }>();
  const contentsService = new ContentsService(c.env.DB);
  const content = await contentsService.createContent(
    title,
    text,
    description,
    ogpImageUrl,
    tags,
    publishKeys
  );
  return c.json(content);
});

contents.get("/", async (c) => {
  const contentsService = new ContentsService(c.env.DB);
  const contents = await contentsService.getContentList();
  return c.json(contents);
});

contents.post("/apiKeys", async (c) => {
  const { name } = await c.req.json<{ name: string }>();
  const publishService = new PublishService(c.env.DB);
  const publishKey = await publishService.createPublishKey(name);
  return c.json(publishKey);
});

contents.get("/apiKeys", async (c) => {
  const publishService = new PublishService(c.env.DB);
  const publishKeys = await publishService.getPublishKeyList();
  return c.json(publishKeys);
});

contents.delete("/apikeys", async (c) => {
  const { keyId } = await c.req.json<{ keyId: string }>();
  const publishService = new PublishService(c.env.DB);
  const publishKeys = await publishService.deletePublishKey(keyId);
  return c.json(publishKeys);
});

contents.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const contentsService = new ContentsService(c.env.DB);
  const key = await contentsService.uploadNonTextAsset(file, c.env.BUCKET);
  return c.json({ key });
});

export default contents;
