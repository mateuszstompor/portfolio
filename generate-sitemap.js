const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const fs = require("fs");
const path = require("path");

const outputPath = path.resolve(__dirname, "sitemap.xml");
const sitemap = new SitemapStream({ hostname: "https://arctic.codes" });

const writeStream = createWriteStream(outputPath);
sitemap.pipe(writeStream);

["/"].forEach((url) => {
  sitemap.write({
    url,
    changefreq: "monthly",
    priority: url === "/" ? 1.0 : 0.8,
  });
});

sitemap.end();

streamToPromise(sitemap).then(() => {
  console.log("✅ Sitemap written to", outputPath);
});
