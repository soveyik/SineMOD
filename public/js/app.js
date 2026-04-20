var s={async get(e){let t=await fetch(e);if(!t.ok){let r=await t.json();throw new Error(r.message||"Bir hata olu\u015Ftu.")}return t.json()},async post(e,t){let r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),n=await r.json();if(!r.ok)throw new Error(n.message||"Bir hata olu\u015Ftu.");return n}};var a=class{constructor(){this.user=null;this.init()}async init(){try{let t=await s.get("/api/auth/me");this.user=t.user,this.updateNavbar()}catch{this.user=null,this.updateNavbar()}}updateNavbar(){let t=document.getElementById("nav-right");t&&(this.user?(t.innerHTML=`
                <span class="text-sm font-medium mr-4">Merhaba, ${this.user.name}</span>
                ${this.user.role==="admin"?'<a href="/admin" class="hover:text-blue-500 mr-4">Y\xF6netim</a>':""}
                <button id="logout-btn" class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">\xC7\u0131k\u0131\u015F</button>
            `,document.getElementById("logout-btn")?.addEventListener("click",()=>this.logout())):t.innerHTML=`
                <a href="/login" class="mr-4 hover:text-blue-500">Giri\u015F Yap</a>
                <a href="/register" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Kay\u0131t Ol</a>
            `)}async logout(){await fetch("/api/auth/logout",{method:"POST"}),window.location.href="/login"}},u=new a;export{u as app};
