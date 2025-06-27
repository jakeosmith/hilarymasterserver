const STAGES = ["Arrival","Inspection","Mechanical","Detail","Photos","Online"];
const USERS = {admin:"admin", user:"user"};
let currentUser = null;
let vehicles = [];

function loadData() {
  const data = localStorage.getItem('vehicles');
  if (data) vehicles = JSON.parse(data);
}
function saveData() {
  localStorage.setItem('vehicles', JSON.stringify(vehicles));
}
function login(username, password) {
  const user = username.trim()
  const pass = password.trim()
  if (USERS[user] === pass) {
    currentUser = user
    document.getElementById('login').classList.add('d-none')
    document.getElementById('app').classList.remove('d-none')
    document.getElementById('userWelcome').textContent = `Welcome, ${user}`
    renderList();
  } else {
    alert('Invalid credentials');
  }
}
function logout() {
  currentUser = null;
  document.getElementById('app').classList.add('d-none');
  document.getElementById('login').classList.remove('d-none');
}
function reset() {
  localStorage.removeItem('vehicles');
  vehicles = [];
  renderList();
  document.getElementById('detailPane').style.display='none';
}
function renderList() {
  const list = document.getElementById('vehicleList');
  list.innerHTML = '';
  vehicles.forEach(v => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${v.vin} - ${v.year} ${v.make} ${v.model}`;
    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary stage-badge';
    badge.textContent = v.stage;
    li.appendChild(badge);
    li.onclick = () => selectVehicle(v.vin);
    list.appendChild(li);
  });
}
function selectVehicle(vin) {
  const vehicle = vehicles.find(v => v.vin === vin);
  if (!vehicle) return;
  document.getElementById('detailPane').style.display='block';
  document.getElementById('vinHeading').textContent = `${vehicle.vin} - ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  document.getElementById('stageSelect').value = vehicle.stage;
  document.getElementById('laborCost').value = vehicle.laborCost || 0;
  document.getElementById('partsCost').value = vehicle.partsCost || 0;
  document.getElementById('totalCost').value = (Number(vehicle.laborCost||0)+Number(vehicle.partsCost||0)).toFixed(2);
  renderParts(vehicle);
  document.getElementById('stageSelect').onchange = (e)=> { vehicle.stage = e.target.value; saveData(); renderList(); };
  document.getElementById('laborCost').oninput = (e)=> { vehicle.laborCost = parseFloat(e.target.value||'0'); updateTotal(vehicle); };
  document.getElementById('partsCost').oninput = (e)=> { vehicle.partsCost = parseFloat(e.target.value||'0'); updateTotal(vehicle); };
  document.getElementById('addPart').onclick = ()=> addPart(vehicle);
}
function updateTotal(v){
  v.total = Number(v.laborCost||0)+Number(v.partsCost||0);
  document.getElementById('totalCost').value = v.total.toFixed(2);
  saveData();
}
function renderParts(vehicle){
  const list = document.getElementById('partsList');
  list.innerHTML='';
  vehicle.parts = vehicle.parts || [];
  vehicle.parts.forEach((p,idx)=>{
    const li = document.createElement('li');
    li.className='list-group-item part-item';
    const span = document.createElement('span');
    span.textContent=`${p.name}`;
    const select = document.createElement('select');
    select.className='form-select form-select-sm w-auto';
    ['Ordered','Received','Installed'].forEach(s=>{
      const opt=document.createElement('option'); opt.value=s; opt.textContent=s; select.appendChild(opt);});
    select.value=p.status;
    select.onchange = (e)=>{ p.status=e.target.value; saveData(); };
    const remove=document.createElement('button');
    remove.className='btn-close';
    remove.onclick=()=>{ vehicle.parts.splice(idx,1); saveData(); renderParts(vehicle); };
    li.appendChild(span); li.appendChild(select); li.appendChild(remove);
    list.appendChild(li);
  });
}
function addPart(vehicle){
  const name=document.getElementById('partName').value.trim();
  if(!name) return;
  vehicle.parts.push({name, status:'Ordered'});
  document.getElementById('partName').value='';
  saveData();
  renderParts(vehicle);
}
async function lookupVin(){
  const vin=document.getElementById('vinInput').value.trim();
  if(!vin) return;
  const existing=vehicles.find(v=>v.vin===vin);
  if(existing){
    selectVehicle(vin); return;
  }
  try{
    const res=await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/${vin}?format=json`);
    const data=await res.json();
    const result=data.Results?.[0]||{};
    const vehicle={vin,year:result.ModelYear||'',make:result.Make||'',model:result.Model||'',stage:'Arrival',laborCost:0,partsCost:0,total:0,parts:[]};
    vehicles.push(vehicle);
    saveData();
    renderList();
    selectVehicle(vin);
  }catch(e){
    alert('Failed to decode VIN');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginBtn').addEventListener('click', () =>
    login(
      document.getElementById('username').value.trim(),
      document.getElementById('password').value.trim()
    )
  )
  document.getElementById('logoutBtn').addEventListener('click', logout)
  document.getElementById('resetBtn').addEventListener('click', reset)
  document.getElementById('lookupBtn').addEventListener('click', lookupVin)
  loadData()
})
