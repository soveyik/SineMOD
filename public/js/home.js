var c={async get(e){let r=await fetch(e);if(!r.ok){let n=await r.json();throw new Error(n.message||"Bir hata olu\u015Ftu.")}return r.json()},async post(e,r){let n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),s=await n.json();if(!n.ok)throw new Error(s.message||"Bir hata olu\u015Ftu.");return s}};document.addEventListener("DOMContentLoaded",async()=>{let e=document.getElementById("movie-grid"),r=document.getElementById("category-list"),n=document.getElementById("grid-title");async function s(i=""){if(e){e.innerHTML=`
            <div class="col-span-full flex justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;try{let o=i?`/api/movies?category=${i}`:"/api/movies",a=await c.get(o);if(e.innerHTML="",a.length===0){e.innerHTML='<p class="col-span-full text-center text-gray-500 py-10 font-bold">Bu kategoride hen\xFCz film bulunmuyor.</p>';return}a.forEach((t,p)=>{let u=t.categories?t.categories.map(l=>l.name).join(", "):"",g=`
                    <a href="/watch?id=${t._id}" class="movie-card group relative block overflow-hidden rounded-2xl bg-gray-800 ring-1 ring-white/10" style="animation: fadeIn 0.5s ease-out ${p*.1}s forwards; opacity: 0;">
                        <!-- Film Afi\u015Fi -->
                        <div class="aspect-[2/3] w-full overflow-hidden">
                            <img src="${t.thumbnailUrl||"https://via.placeholder.com/300x450"}" alt="${t.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
                        </div>
                        
                        <!-- Bilgi Katman\u0131 (Overlay) -->
                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div class="flex flex-wrap gap-1 mb-2">
                                    ${t.categories?t.categories.map(l=>`<span class="bg-blue-600/80 text-[10px] px-2 py-0.5 rounded-full text-white font-bold">${l.name}</span>`).join(""):""}
                                </div>
                                <h3 class="text-lg font-bold text-white mb-1">${t.title}</h3>
                                <div class="flex items-center space-x-2 text-xs text-blue-400 font-bold">
                                    <span>${t.viewCount} \u0130zlenme</span>
                                    <span class="h-1 w-1 rounded-full bg-gray-500"></span>
                                    <span>\u015Eimdi \u0130zle</span>
                                </div>
                            </div>
                        </div>

                        <!-- Alt Bilgi (Her zaman g\xF6r\xFCn\xFCr) -->
                        <div class="p-3">
                            <h4 class="font-bold text-sm truncate text-gray-200">${t.title}</h4>
                            <p class="text-[10px] text-gray-500 truncate">${u}</p>
                        </div>
                    </a>
                `;e.insertAdjacentHTML("beforeend",g)})}catch{e.innerHTML='<p class="text-red-500">Filmler y\xFCklenirken bir hata olu\u015Ftu.</p>'}}}async function d(){if(r)try{(await c.get("/api/categories")).forEach(o=>{let a=document.createElement("button");a.className="category-pill glass px-6 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all hover:bg-blue-600 border border-white/5",a.textContent=o.name,a.dataset.id=o._id,a.addEventListener("click",()=>{document.querySelectorAll(".category-pill").forEach(t=>t.classList.remove("bg-blue-600","active","shadow-xl")),a.classList.add("bg-blue-600","active","shadow-xl"),n&&(n.textContent=`${o.name} Filmleri`),s(o._id)}),r.appendChild(a)})}catch{console.error("Kategoriler y\xFCklenemedi")}}d(),s()});
