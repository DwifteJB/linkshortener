import prisma from "./prisma";
import crypto from "crypto";

export default async function pregenerateString(url: string) {
  let id = url + crypto.randomBytes(4).toString("hex");
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  let realId = crypto.createHash("sha256").update(id).digest("hex").slice(0, 8);

  const exists = await prisma.shortenedUrl.findUnique({
    where: {
      id: realId,
    },
  });

  if (exists) {
    return await pregenerateString(url);
  } // if exists, generate a new one, this COULD be an infinite loop :3

  return realId;
}
