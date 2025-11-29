/* ---------------- TABS ---------------- */
let tabs={},activeTab=null;

function createTab(){
    let id="tab"+Date.now();
    tabs[id]={page:"home"};
    let div=document.createElement("div");
    div.className="tab"; div.id=id;
    div.innerHTML=`<span>New Tab</span><span class="closeBtn" onclick="closeTab('${id}',event)">x</span>`;
    div.onclick=()=>setActiveTab(id);
    document.getElementById("tabBar").insertBefore(div,document.getElementById("newTab"));
    setActiveTab(id);
}

function closeTab(id,e){
    e.stopPropagation();
    let tab=document.getElementById(id);
    tab.classList.add("removing");
    tab.addEventListener("transitionend",()=>{tab.remove(); delete tabs[id]; if(activeTab===id){let o=Object.keys(tabs)[0];if(o)setActiveTab(o);else createTab();}}, {once:true});
}

function setActiveTab(id){
    activeTab=id;
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    openTab(tabs[id].page);
}

function openTab(page){
    document.querySelectorAll(".page").forEach(p=>p.style.display="none");
    tabs[activeTab].page=page;
    if(page==="home")document.getElementById("homepage").style.display="block";
    if(page==="results")document.getElementById("resultsPage").style.display="block";
    if(page==="image")document.getElementById("imagePage").style.display="block";
    if(page==="browser")document.getElementById("browserPage").style.display="block";
}

/* ---------------- DARK MODE ---------------- */
function toggleDark(){document.body.classList.toggle("dark");}

/* ---------------- SETTINGS ---------------- */
function openSettings(){document.getElementById("settingsPopup").style.display="block";}
function saveSettings(){
    let sel=document.querySelector("input[name=engine]:checked");
    if(sel) localStorage.setItem("engine",sel.value);
    document.getElementById("settingsPopup").style.display="none";
}

/* ---------------- ENTER SUPPORT ---------------- */
document.getElementById("searchInput").addEventListener("keydown",function(e){
    if(e.key==="Enter"){e.preventDefault();doSearch();}
});

/* ---------------- SEARCH ---------------- */
function doSearch(){
    let q=document.getElementById("searchInput").value.trim();
    if(!q)return;
    let engine=localStorage.getItem("engine")||"google";
    openTab("results");

    // Simulate search results (replace with real API if needed)
    let resultsDiv=document.getElementById("resultsContainer");
    resultsDiv.innerHTML="";
    for(let i=1;i<=5;i++){
        let link = q.startsWith("http") ? q : (engine==="google" ? "https://www.google.com/search?q="+encodeURIComponent(q) : engine==="bing" ? "https://www.bing.com/search?q="+encodeURIComponent(q) : "https://duckduckgo.com/?q="+encodeURIComponent(q));
        let card=document.createElement("div"); card.className="resultCard";
        card.innerHTML=`<a href="${link}" target="_blank">${q} Result ${i}</a>`;
        resultsDiv.appendChild(card);
    }
}

// Image search opens browser iframe
function imageSearch(){
    let q=document.getElementById("searchInput").value.trim();
    if(!q)return;
    let url="https://duckduckgo.com/?q="+encodeURIComponent(q)+"&iax=images&ia=images";
    document.getElementById("browserURL").value=url;
    openBrowser();
}

/* ---------------- BROWSER ---------------- */
function openBrowser(){
    openTab("browser");
    let url=document.getElementById("browserURL").value;
    let content=document.getElementById("browserContent");
    let blocked=document.getElementById("blockedMsg");
    blocked.style.display="none";
    if(url.includes("blocked.com")){blocked.style.display="block"; content.src="about:blank"; return;}
    content.src=url;
}

/* ---------------- CLICK RESULTS: OPEN IN NEW IFRAME TAB ---------------- */
document.addEventListener('click', function(e) {
    if(e.target.tagName==="A" && e.target.closest("#resultsContainer")){
        e.preventDefault();
        let url=e.target.href;
        // Open new tab with full-page iframe
        let win = window.open("", "_blank");
        if(!win){alert("Pop-ups blocked!"); return;}
        let iframe=document.createElement("iframe");
        iframe.style.width="100%";
        iframe.style.height="100%";
        iframe.style.border="none";
        iframe.src=url;
        win.document.body.style.margin="0";
        win.document.body.appendChild(iframe);
    }
});

// Create first tab on load
createTab();
