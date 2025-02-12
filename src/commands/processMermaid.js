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
            
            // Add custom Mermaid configuration
            const mermaidConfig = {
                theme: 'default',
                themeVariables: {
                    pie1: '#3498db',  // Blue
                    pie2: '#e74c3c',  // Red
                    pie3: '#2ecc71',  // Green
                    pie4: '#f1c40f',  // Yellow
                    pie5: '#9b59b6',  // Purple
                    pie6: '#1abc9c',  // Turquoise
                    pie7: '#e67e22',  // Orange
                    pie8: '#34495e',  // Navy
                    pie9: '#95a5a6',  // Gray
                    pie10: '#d35400', // Dark Orange
                    primaryColor: '#2c3e50',
                    primaryTextColor: '#ecf0f1',
                    fontFamily: 'Segoe UI'
                }
            };
            
            const configPath = path.join(outputDir, `config_${blockCount}.json`);
            await fs.writeFile(configPath, JSON.stringify(mermaidConfig));
            
            const mermaidPath = path.join(outputDir, `diagram_${blockCount}.mmd`);
            const svgPath = path.join(outputDir, `diagram_${blockCount}.svg`);
            
            await writeOutputFile(mermaidPath, mermaidContent);
            
            try {
                await execPromise(`npx mmdc -i "${mermaidPath}" -o "${svgPath}" -c "${configPath}"`);
            } catch (error) {
                console.error('Mermaid generation error:', error);
                console.log('Problematic Mermaid content:', mermaidContent);
                throw error;
            }
            
            const svgContent = await fs.readFile(svgPath, 'utf-8');
            
            processedContent = processedContent.replace(
                match[0],
                `<div class="mermaid-diagram">\n${svgContent}\n</div>`
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