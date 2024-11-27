import pregenerateString from "~/lib/pregenerateString";
import prisma from "~/lib/prisma";

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
            body: {
                error: "No URL provided"
            }
        }
    }

    const id = await pregenerateString(url);

    const data = await prisma.shortenedUrl.create({
        data: {
            id,
            url
        }
    });

    return {
        status: 200,
        id: data.id
    }
})