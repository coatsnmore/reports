const markdownpdf = require('markdown-pdf');
const path = require('path');

async function generatePdf(inputPath, outputPath, cssPath) {
    return new Promise((resolve, reject) => {
        markdownpdf({
            cssPath,
            remarkable: {
                html: true,
                breaks: true,
                typographer: true
            },
            paperBorder: '1cm',
            renderDelay: 2000
        })
        .from(inputPath)
        .to(outputPath, resolve);
    });
}

module.exports = generatePdf; 