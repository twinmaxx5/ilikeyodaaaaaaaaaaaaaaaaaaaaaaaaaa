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

    let resultsDiv=document.getElementById("resultsContainer");
    resultsDiv.innerHTML="";
    for(let i=1;i<=5;i++){
        let link = q.startsWith("http") ? q : (engine==="google" ? "https://www.google.com/search?q="+encodeURIComponent(q) : engine==="bing" ? "https://www.bing.com/search?q="+encodeURIComponent(q) : "https://duckduckgo.com/?q="+encodeURIComponent(q));
        let card=document.createElement("div"); card.className="resultCard";
        card.innerHTML=`<a href="${link}" target="_blank">${q} Result ${i}</a>`;
        resultsDiv.appendChild(card);
    }
}

// Image search (opens DuckDuckGo image search in new tab)
function imageSearch(){
    let q=document.getElementById("searchInput").value.trim();
    if(!q)return;
    let url="https://duckduckgo.com/?q="+encodeURIComponent(q)+"&iax=images&ia=images";
    window.open(url,"_blank");
}

// Create first tab on load
createTab();
