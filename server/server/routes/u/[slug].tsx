import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  console.log("slug", slug);
  const url = await prisma.shortenedUrl.findUnique({
    where: {
      id: slug,
    },
  });

  console.log("url", url);

  if (url) {
    await prisma.shortenedUrl.update({
      where: {
        id: slug,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    const targetUrl = url.url.startsWith("http")
      ? url.url
      : `https://${url.url}`;
    console.log("redirecting to", targetUrl);
    return sendRedirect(event, targetUrl);
  }

  return slug;
});
