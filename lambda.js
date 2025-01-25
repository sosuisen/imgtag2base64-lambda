const execute = async (event, context) => {
    try {
        // gets agent context data
        let agentContext = {};

        if (event && event.body) {
            const body = JSON.parse(event.body);
            if (body.context) {
                agentContext = body.context;
            }
        }

        const imgtag = agentContext.imgtag;

        if (!imgtag) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'imgtag is required' })
            };
        }
        // src may be in quotes or not
        const match = imgtag.match(/<img[^>]+src="?([^" >]+)/);
        if (!match) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No valid image URL found' })
            };
        }

        const imageUrl = match[1];

        const response = await fetch(imageUrl);
        if (!response.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch image' })
            };
        }

        const imageBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(imageBuffer).toString('base64');

        return {
            statusCode: 200,
            body: JSON.stringify({ base64 })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process the request' })
        };
    }

};

module.exports = { execute };
