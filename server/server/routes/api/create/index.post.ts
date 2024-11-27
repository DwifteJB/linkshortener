import pregenerateString from "~/lib/pregenerateString";
import prisma from "~/lib/prisma";

const linkRegex = /^(http|https):\/\/[^ "]+$/;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let realBody;

  if (typeof body === "string") {
    realBody = JSON.parse(body);
  } else {
    realBody = body;
  }

  const url = realBody.url;

  if (!url) {
    return {
      status: 400,
      error: "No URL provided",
    };
  }

  if (!linkRegex.test(url)) {
    return {
      status: 400,
      error: "Invalid URL",
    };
  }

  const id = await pregenerateString(url);

  const data = await prisma.shortenedUrl.create({
    data: {
      id,
      url,
    },
  });

  return {
    status: 200,
    id: data.id,
  };
});
