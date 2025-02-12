const fs = require('fs-extra');
const { exec } = require('child_process');
const markdownpdf = require('markdown-pdf');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

async function processTemplate(markdownContent, jsonData) {
    // Replace template variables
    let processedContent = markdownContent;
    
    // Recursively traverse the JSON object to handle nested properties
    function replaceTemplateVars(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                replaceTemplateVars(value, fullKey);
            } else {
                const regex = new RegExp(`{{\\s*${fullKey}\\s*}}`, 'g');
                processedContent = processedContent.replace(regex, value);
            }
        }
    }

    replaceTemplateVars(jsonData);
    return processedContent;
}

async function processMermaidBlocks(markdownContent, outputDir) {
    const mermaidRegex = /```mermaid\s*([\s\S]*?)\s*```/g;
    let match;
    let processedContent = markdownContent;
    let blockCount = 0;

    while ((match = mermaidRegex.exec(markdownContent)) !== null) {
        try {
            // Extract Mermaid content and trim whitespace
            const mermaidContent = match[1].trim();
            
            // Generate temporary files
            const mermaidPath = path.join(outputDir, `diagram_${blockCount}.mmd`);
            const svgPath = path.join(outputDir, `diagram_${blockCount}.svg`);
            
            // Write Mermaid content to file
            await fs.writeFile(mermaidPath, mermaidContent);
            
            // Generate SVG with better error handling
            try {
                await execPromise(`npx mmdc -i "${mermaidPath}" -o "${svgPath}"`);
            } catch (error) {
                console.error('Mermaid generation error:', error);
                console.log('Problematic Mermaid content:', mermaidContent);
                throw error;
            }
            
            // Read generated SVG
            const svgContent = await fs.readFile(svgPath, 'utf-8');
            
            // Replace Mermaid block with SVG wrapped in markdown image syntax
            processedContent = processedContent.replace(
                match[0],
                `<div class="mermaid-diagram" style="text-align: center;">\n${svgContent}\n</div>`
            );
            
            blockCount++;
        } catch (error) {
            console.error(`Error processing Mermaid block ${blockCount}:`, error);
            throw error;
        }
    }
    
    return processedContent;
}

async function generateDocument(markdownPath, jsonPath, outputDir = './output') {
    try {
        // Create output directory if it doesn't exist
        await fs.ensureDir(outputDir);

        // Read input files
        const [markdownContent, jsonData] = await Promise.all([
            fs.readFile(markdownPath, 'utf-8'),
            fs.readJson(jsonPath)
        ]);

        // Process template variables first
        const templateProcessed = await processTemplate(markdownContent, jsonData);

        // Process Mermaid blocks after template variables are replaced
        const mermaidProcessed = await processMermaidBlocks(templateProcessed, outputDir);

        // Write processed markdown
        const processedPath = path.join(outputDir, 'output.md');
        await fs.writeFile(processedPath, mermaidProcessed);

        // Convert to PDF with updated options
        const pdfPath = path.join(outputDir, 'output.pdf');
        await new Promise((resolve, reject) => {
            markdownpdf({
                cssPath: path.join(__dirname, 'pdf-style.css'),
                remarkable: {
                    html: true,
                    breaks: true,
                    typographer: true
                },
                paperBorder: '1cm',
                renderDelay: 2000, // Give time for SVGs to render
                phantomPath: require('phantomjs-prebuilt').path
            })
            .from(processedPath)
            .to(pdfPath, resolve);
        });

        console.log('Generation complete! Check the output directory.');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Handle command line arguments
const markdownPath = process.argv[2] || './input.md';
const jsonPath = process.argv[3] || './input.json';

if (!markdownPath.endsWith('.md')) {
    console.error('First argument must be a markdown file (.md)');
    process.exit(1);
}

if (!jsonPath.endsWith('.json')) {
    console.error('Second argument must be a JSON file (.json)');
    process.exit(1);
}

generateDocument(markdownPath, jsonPath); 