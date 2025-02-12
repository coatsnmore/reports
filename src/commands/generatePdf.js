const MarkdownIt = require('markdown-it');
const highlightjs = require('markdown-it-highlightjs');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');

async function generatePdf(inputPath, outputPath, cssPath) {
    // Create markdown-it instance with syntax highlighting
    const md = new MarkdownIt({
        html: true,
        breaks: true,
        typographer: true
    }).use(highlightjs, {
        inline: true,
        hljs: {
            style: 'atom-one-dark',
            languages: ['bash', 'python', 'java', 'javascript', 'json', 'markdown']
        }
    });

    // Read files
    const [content, css] = await Promise.all([
        fs.readFile(inputPath, 'utf-8'),
        fs.readFile(cssPath, 'utf-8')
    ]);

    // Process markdown to HTML
    const processedHtml = md.render(content);
    
    // Create full HTML document
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>${css}</style>
        </head>
        <body>
            ${processedHtml}
        </body>
        </html>
    `;

    // Write temporary HTML file
    const tempHtmlPath = path.join(path.dirname(outputPath), 'temp.html');
    await fs.writeFile(tempHtmlPath, htmlContent);

    try {
        // Launch browser
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Load HTML
        await page.goto(`file:${path.resolve(tempHtmlPath)}`, {
            waitUntil: 'networkidle0'
        });

        // Generate PDF
        await page.pdf({
            path: outputPath,
            format: 'A4',
            margin: {
                top: '2cm',
                right: '2cm',
                bottom: '2cm',
                left: '2cm'
            },
            printBackground: true
        });

        await browser.close();
    } finally {
        // Clean up temporary file
        await fs.remove(tempHtmlPath);
    }
}

module.exports = generatePdf; 