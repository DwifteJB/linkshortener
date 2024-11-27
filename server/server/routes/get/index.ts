import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const allLinks = await prisma.shortenedUrl.findMany();

    let dots = [];

    for (const link of allLinks) {
        dots.push({
            size: Math.max(1, Math.min(20, link.clicks / 4)),
            velocity: Math.max(1, Math.min(50, link.clicks / 2)),
        });
    }

    return {
        status: 200,
        body: {
            dots
        }
    }
});