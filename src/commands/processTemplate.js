const processTemplate = (markdownContent, jsonData) => {
    let processedContent = markdownContent;
    
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
};

module.exports = processTemplate; 