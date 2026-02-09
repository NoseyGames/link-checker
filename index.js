const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import your modules
// Make sure these paths match your file tree!
const { goguardian } = require('./modules/goguardian');
const { securly } = require('./modules/securly');
const { cisco } = require('./modules/cisco');
const { fortiguard } = require('./modules/fortiguard');
const { lightspeed } = require('./modules/lightspeed');
const { iboss } = require('./modules/iboss');
// Add others as needed...

app.get('/check', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a URL parameter, e.g., ?url=google.com" });
    }

    console.log(`Checking URL: ${targetUrl}`);

    try {
        // We use Promise.allSettled so that if one filter fails/timeouts, 
        // the others still return data.
        const [gg, sec, cis, fort, ls, ib] = await Promise.allSettled([
            goguardian(targetUrl),
            securly(targetUrl),
            cisco(targetUrl),
            fortiguard(targetUrl),
            lightspeed(targetUrl),
            iboss(targetUrl)
        ]);

        const results = {
            url: targetUrl,
            timestamp: new Date().toISOString(),
            reports: {
                goguardian: gg.status === 'fulfilled' ? gg.value : { error: gg.reason },
                securly: sec.status === 'fulfilled' ? sec.value : { error: sec.reason },
                cisco: cis.status === 'fulfilled' ? cis.value : { error: cis.reason },
                fortiguard: fort.status === 'fulfilled' ? fort.value : { error: fort.reason },
                lightspeed: ls.status === 'fulfilled' ? ls.value : { error: ls.reason },
                iboss: ib.status === 'fulfilled' ? ib.value : { error: ib.reason },
            }
        };

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Filter Checker Server running on http://localhost:${PORT}`);
    console.log(`Try checking a site: http://localhost:${PORT}/check?url=discord.com`);
});
