import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import './validate.mjs';
await rm('dist', {recursive:true, force:true});
await mkdir('dist', {recursive:true});
await cp('public', 'dist', {recursive:true});
const prompts = JSON.parse(await readFile('prompts.json', 'utf8'));
await writeFile('netlify/functions/_shared/prompt-ids.mjs', `export default ${JSON.stringify(prompts.map(p=>p.id))};\n`);
await writeFile('dist/data.js', `window.PROMPTVERSE_PROMPTS = ${JSON.stringify(prompts)};\n`);
console.log(`Built Promptverse with ${prompts.length} prompts.`);
