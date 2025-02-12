const path = require('path');
const processTemplate = require('./src/commands/processTemplate');
const processMermaidBlocks = require('./src/commands/processMermaid');
const generatePdf = require('./src/commands/generatePdf');
const { ensureOutputDir, readInputFiles, writeOutputFile } = require('./src/utils/fileUtils');

async function generateDocument(markdownPath, jsonPath, outputDir = './output') {
    try {
        await ensureOutputDir(outputDir);

        const [markdownContent, jsonData] = await readInputFiles(markdownPath, jsonPath);
        
        const templateProcessed = processTemplate(markdownContent, jsonData);
        const mermaidProcessed = await processMermaidBlocks(templateProcessed, outputDir);

        const processedPath = path.join(outputDir, 'output.md');
        await writeOutputFile(processedPath, mermaidProcessed);

        const pdfPath = path.join(outputDir, 'output.pdf');
        const cssPath = path.join(__dirname, 'pdf-style.css');
        await generatePdf(processedPath, pdfPath, cssPath);

        console.log('Generation complete! Check the output directory.');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Handle command line arguments
const markdownPath = process.argv[2] || './input/input.md';
const jsonPath = process.argv[3] || './input/input.json';

if (!markdownPath.endsWith('.md')) {
    console.error('First argument must be a markdown file (.md)');
    process.exit(1);
}

if (!jsonPath.endsWith('.json')) {
    console.error('Second argument must be a JSON file (.json)');
    process.exit(1);
}

generateDocument(markdownPath, jsonPath); 