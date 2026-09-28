import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/agent.js";
async function run(body){let code,json;await handler({method:"POST",body},{status:n=>({json:x=>{code=n;json=x}})});return{code,json}}
test("agent prioritizes known successful fix and avoids failed step",async()=>{const r=await run({message:"My files aren't syncing again",customer:{name:"Aarav Mehta"},memories:["Reinstalling CloudSync did not resolve the issue.","Network configuration successfully resolved the synchronization problem.","Aarav prefers concise troubleshooting."]});assert.equal(r.code,200);assert.match(r.json.response,/won’t repeat/i);assert.match(r.json.response,/network configuration/i);assert.equal(r.json.usedMemories.length,3)});
