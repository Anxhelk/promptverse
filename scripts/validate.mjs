import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const prompts=JSON.parse(await readFile('prompts.json','utf8'));
const cats=['writing','marketing','product','design','coding','business','sales','productivity','learning','research','data','career','lifestyle','creativity','operations'];
assert.equal(prompts.length,180);
assert.equal(new Set(prompts.map(p=>p.id)).size,prompts.length,'Prompt IDs must be unique');
for(const cat of cats)assert.equal(prompts.filter(p=>p.category===cat).length,12,cat);
for(const p of prompts){
  assert.ok(p.id&&p.title&&p.description&&p.prompt,p.id);
  assert.ok(cats.includes(p.category),p.id);
  assert.ok(Array.isArray(p.tags)&&p.tags.length>=2,p.id);
  assert.ok(['Starter','Intermediate','Advanced'].includes(p.difficulty),p.id);
  assert.ok(p.prompt.length>=300,p.id);
  assert.ok(/\[[^\]]+\]/.test(p.prompt),p.id);
}
console.log(`Validated ${prompts.length} distinct prompts in ${cats.length} categories.`);
