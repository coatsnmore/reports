const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const { writeOutputFile } = require('../utils/fileUtils');

const execPromise = util.promisify(exec);

async function processMermaidBlocks(markdownContent, outputDir) {
    const mermaidRegex = /```mermaid\s*([\s\S]*?)\s*```/g;
    let match;
    let processedContent = markdownContent;
    let blockCount = 0;

    while ((match = mermaidRegex.exec(markdownContent)) !== null) {
        try {
            const mermaidContent = match[1].trim();
            
            const mermaidPath = path.join(outputDir, `diagram_${blockCount}.mmd`);
            const svgPath = path.join(outputDir, `diagram_${blockCount}.svg`);
            
            await writeOutputFile(mermaidPath, mermaidContent);
            
            try {
                await execPromise(`npx mmdc -i "${mermaidPath}" -o "${svgPath}"`);
            } catch (error) {
                console.error('Mermaid generation error:', error);
                console.log('Problematic Mermaid content:', mermaidContent);
                throw error;
            }
            
            const svgContent = await fs.readFile(svgPath, 'utf-8');
            
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

module.exports = processMermaidBlocks; 