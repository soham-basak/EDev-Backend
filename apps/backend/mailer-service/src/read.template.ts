import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const getTemplate = (): string => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const emailTemplatePath = path.join(__dirname, './template/index.html');
    return fs.readFileSync(emailTemplatePath, 'utf-8');
};

export default getTemplate;
