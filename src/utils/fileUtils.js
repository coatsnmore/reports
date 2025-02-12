const fs = require('fs-extra');
const path = require('path');

const ensureOutputDir = async (outputDir) => {
    await fs.ensureDir(outputDir);
};

const readInputFiles = async (markdownPath, jsonPath) => {
    return Promise.all([
        fs.readFile(markdownPath, 'utf-8'),
        fs.readJson(jsonPath)
    ]);
};

const writeOutputFile = async (filePath, content) => {
    await fs.writeFile(filePath, content);
};

module.exports = {
    ensureOutputDir,
    readInputFiles,
    writeOutputFile
}; 