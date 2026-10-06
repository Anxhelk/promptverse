import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const args=process.argv.slice(2);
const flag=args.indexOf('--port');
const port=Number(flag>=0?args[flag+1]:process.env.PORT||4173);
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json'};
http.createServer(async(req,res)=>{
  try{
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname==='/data.js'){
      res.writeHead(200,{'Content-Type':'text/javascript'});
      res.end(`window.PROMPTVERSE_PROMPTS = ${await readFile('prompts.json','utf8')};`);return;
    }
    if(pathname==='/'||!path.extname(pathname))pathname='/index.html';
    const file=path.resolve('public',`.${pathname}`);
    if(!file.startsWith(path.resolve('public')+path.sep))throw Error('Invalid path');
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
    res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(port,'0.0.0.0',()=>console.log(`Promptverse ready on port ${port}`));
