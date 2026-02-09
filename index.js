const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static('public'));

// Import ALL your modules
const { goguardian } = require('./modules/goguardian');
const { securly } = require('./modules/securly');
const { cisco } = require('./modules/cisco');
const { fortiguard } = require('./modules/fortiguard');
const { lightspeed } = require('./modules/lightspeed');
const { iboss } = require('./modules/iboss');
const { blocksiAI, blocksiStandard } = require('./modules/blocksi');
const { contentkeeper } = require('./modules/contentkeeper');
const { deledao } = require('./modules/deledao');
const { lanschool } = require('./modules/lanschool');
const { linewize } = require('./modules/linewize');
const { palo } = require('./modules/paloalto');
const { sensocloud } = require('./modules/senso');
const { aristotlek12 } = require('./modules/aristotle');

// API endpoint - checks ALL filters
app.get('/check', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: "Please provide a URL parameter, e.g., ?url=google.com" });
    }

    console.log(`Checking URL: ${targetUrl}`);

    try {
        const [
            gg, sec, cis, fort, ls, ib,
            blockai, blockstd, ck, dele, lan, line, pal, sen, ari
        ] = await Promise.allSettled([
            goguardian(targetUrl),
            securly(targetUrl),
            cisco(targetUrl),
            fortiguard(targetUrl),
            lightspeed(targetUrl),
            iboss(targetUrl),
            blocksiAI(targetUrl),
            blocksiStandard(targetUrl),
            contentkeeper(targetUrl),
            deledao(targetUrl),
            lanschool(targetUrl),
            linewize(targetUrl),
            palo(targetUrl),
            sensocloud(targetUrl),
            aristotlek12(targetUrl)
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
                blocksiAI: blockai.status === 'fulfilled' ? blockai.value : { error: blockai.reason },
                blocksiStandard: blockstd.status === 'fulfilled' ? blockstd.value : { error: blockstd.reason },
                contentkeeper: ck.status === 'fulfilled' ? ck.value : { error: ck.reason },
                deledao: dele.status === 'fulfilled' ? dele.value : { error: dele.reason },
                lanschool: lan.status === 'fulfilled' ? lan.value : { error: lan.reason },
                linewize: line.status === 'fulfilled' ? line.value : { error: line.reason },
                paloalto: pal.status === 'fulfilled' ? pal.value : { error: pal.reason },
                senso: sen.status === 'fulfilled' ? sen.value : { error: sen.reason },
                aristotle: ari.status === 'fulfilled' ? ari.value : { error: ari.reason }
            }
        };

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Filter Checker Server running on port ${PORT}`);
    console.log(`Checking 14 school filters!`);
});
