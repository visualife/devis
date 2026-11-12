const { chromium } = require("C:/Users/studi.REAL/AppData/Roaming/npm/node_modules/@playwright/mcp/node_modules/playwright-core");
(async()=>{
  const b=await chromium.launch({executablePath:"C:/Users/studi.REAL/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe"});
  const p=await b.newPage({viewport:{width:1280,height:800}});
  const failed=[]; p.on("requestfailed",r=>failed.push(r.url().split("/").slice(-2).join("/")));
  for (const f of process.argv.slice(2)){
    await p.goto("file:///C:/Users/studi.REAL/Documents/Devis/pages/"+f,{waitUntil:"domcontentloaded"});
    await p.waitForTimeout(3000);
    console.log(f, await p.evaluate(()=>[...document.querySelectorAll(".lp img")].map(i=>i.getAttribute("src").split("/").pop()+":"+i.naturalWidth)));
  }
  console.log("failed:",failed.filter(x=>/images|webp/.test(x)));
  await b.close();
})();
