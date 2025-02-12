const fs = require('fs-extra');
const { exec } = require('child_process');
const markdownpdf = require('markdown-pdf');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

async function generateDiagram(jsonPath, outputDir = './output') {
    try {
        // Create output directory if it doesn't exist
        await fs.ensureDir(outputDir);

        // Read and parse JSON input
        const jsonData = await fs.readJson(jsonPath);

        // Generate Mermaid diagram content based on JSON data
        const mermaidContent = generateMermaidContent(jsonData);

        // Write Mermaid content to temporary file
        const mermaidPath = path.join(outputDir, 'diagram.mmd');
        await fs.writeFile(mermaidPath, mermaidContent);

        // Generate SVG from Mermaid using mmdc CLI
        const svgPath = path.join(outputDir, 'diagram.svg');
        await execPromise(`npx mmdc -i "${mermaidPath}" -o "${svgPath}"`);

        // Read generated SVG
        const svgContent = await fs.readFile(svgPath, 'utf-8');

        // Create Markdown content
        const markdownContent = generateMarkdownContent(jsonData, svgContent);
        const markdownPath = path.join(outputDir, 'output.md');
        await fs.writeFile(markdownPath, markdownContent);

        // Convert Markdown to PDF
        const pdfPath = path.join(outputDir, 'output.pdf');
        await new Promise((resolve, reject) => {
            markdownpdf({
                cssPath: path.join(__dirname, 'pdf-style.css'),
                remarkable: {
                    html: true // Enable HTML in markdown
                }
            })
            .from(markdownPath)
            .to(pdfPath, () => resolve());
        });

        console.log('Generation complete! Check the output directory.');
    } catch (error) {
        console.error('Error:', error);
    }
}

function generateMermaidContent(data) {
    const { type, title, data: chartData } = data;
    
    switch (type) {
        case 'pie':
            return `pie title ${title}
                ${Object.entries(chartData)
                    .map(([label, value]) => `    "${label}" : ${value}`)
                    .join('\n')}`;
        case 'flowchart':
            // Add flowchart generation logic
            return `flowchart TD
                A[Start] --> B[End]`; // Placeholder flowchart logic
        default:
            throw new Error(`Unsupported diagram type: ${type}`);
    }
}

function generateMarkdownContent(jsonData, svgContent) {
    return `# ${jsonData.title}

## Data Visualization

<div style="text-align: center;">
${svgContent}
</div>

## Data Details

${Object.entries(jsonData.data)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n')}
`;
}

// Example usage
const jsonPath = process.argv[2] || './input.json';
generateDiagram(jsonPath); 