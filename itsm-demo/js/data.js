/* ข้อมูลจำลองทั้งหมด (DEMO) */
function t(sec) { return new Date(Date.now() + sec * 1000); }
const DAY = 86400;
const YEAR = new Date().getFullYear();

const users = {
  /* approver = ตัวแทน/หัวหน้าของบริษัทลูกค้า ผู้อนุมัติพนักงานที่สมัครเข้ามา */
  /* skills = หมวดงานที่ช่างถนัด (ใช้แนะนำช่างตอนมอบหมาย) · phone = ใช้เข้าสู่ระบบ */
  cust1:  { id: 'cust1',  name: 'สมหญิง',   role: 'customer',    customer: 'C1', approver: true, phone: '0810000001' },
  cust2:  { id: 'cust2',  name: 'วรรณา',    role: 'customer',    customer: 'C2', approver: true, phone: '0810000002' },
  tech1:  { id: 'tech1',  name: 'ชาติชาย',  role: 'technician',  team: 'T1', phone: '0820000001', skills: ['printer', 'repair', 'install'] },
  tech2:  { id: 'tech2',  name: 'วิภา',     role: 'technician',  team: 'T1', phone: '0820000002', skills: ['account', 'network'] },
  tech3:  { id: 'tech3',  name: 'สมชาย',    role: 'technician',  team: 'T1', phone: '0820000003', skills: ['cctv', 'network', 'install'] },
  lead1:  { id: 'lead1',  name: 'ประภาส',   role: 'team_leader', team: 'T1', phone: '0830000001' },
  admin1: { id: 'admin1', name: 'แอดมินระบบ', role: 'admin', phone: '0840000001' },
};
let nextTechNo = 4;

/* พาร์ทเนอร์ (ลูกค้าองค์กร) → สถานที่ที่เราดูแล */
const CONTRACT_LABEL = { ma: 'สัญญาดูแลรายปี (MA)', oncall: 'บริการรายครั้ง', project: 'งานโครงการ' };
const customers = {
  C1: { id: 'C1', name: 'บริษัท เอบีซี จำกัด', contract: 'ma', contact: 'สมหญิง ใจดี', phone: '02-000-0001', email: 'it@abc.example',
    sites: [
      { id: 'S1', name: 'สำนักงานใหญ่', address: '99/1 อาคารเอบีซี ถนนสุขุมวิท แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110', contact: 'สมหญิง ใจดี', phone: '02-000-0001', lat: 13.7380, lng: 100.5600 },
      { id: 'S2', name: 'คลังสินค้าบางนา', address: '88 หมู่ 5 ถนนบางนา-ตราด กม.18 ตำบลบางโฉลง อำเภอบางพลี สมุทรปราการ 10540', contact: 'ธนพล (หัวหน้าคลัง)', phone: '02-000-0002', lat: 13.6330, lng: 100.7230 },
    ] },
  C2: { id: 'C2', name: 'ร้านสะดวกซื้อ XYZ', contract: 'oncall', contact: 'วรรณา ศรีสุข', phone: '02-000-0101', email: 'admin@xyz.example',
    sites: [
      { id: 'S3', name: 'สาขาลาดพร้าว', address: '1234 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900', contact: 'วรรณา ศรีสุข', phone: '02-000-0101', lat: 13.8160, lng: 100.5610 },
      { id: 'S4', name: 'สาขารัชดา', address: '55 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', contact: 'ผู้จัดการสาขา', phone: '02-000-0102', lat: 13.7660, lng: 100.5700 },
    ] },
  C3: { id: 'C3', name: 'คลินิกทันตกรรมยิ้มสวย', contract: 'project', contact: 'ทพ.อรุณี', phone: '02-000-0201', email: 'contact@smile.example',
    sites: [
      { id: 'S5', name: 'คลินิกอารีย์', address: '7 ซอยอารีย์ 1 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400', contact: 'ทพ.อรุณี', phone: '02-000-0201', lat: 13.7800, lng: 100.5450 },
    ] },
};
let nextCustomerNo = 4, nextSiteNo = 6;
const teams = { T1: 'ทีมบริการภาคสนาม 1' };

const STATUS_FLOW = {
  new: ['assigned'], assigned: ['in_progress'], in_progress: ['pending', 'resolved'],
  pending: ['in_progress'], resolved: ['closed', 'in_progress'], closed: ['in_progress'],
};
const STATUS_LABEL = {
  new: 'ใหม่', assigned: 'มอบหมายแล้ว', in_progress: 'กำลังดำเนินการ',
  pending: 'พักงาน', resolved: 'รอลูกค้าเซ็นรับ', closed: 'ปิดงาน',
};
const PRIORITY_LABEL = { urgent: 'ด่วนมาก', high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ' };
const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
/* ประเภทงาน (ไม่มี type = งานบริการ) — โปรเจกต์แยกเป็นข้อมูลของตัวเองใน projects */
const TYPE_LABEL = { service: 'งานบริการ', complaint: 'ร้องเรียน' };

/* ภาษาที่ลูกค้าเข้าใจ: ย่อ 6 สถานะเหลือ 4 ขั้น */
const CUST_STEPS = ['รับเรื่อง', 'มอบหมายช่าง', 'กำลังแก้ไข', 'เสร็จสิ้น'];
const CUST_STAGE = { new: 0, assigned: 1, in_progress: 2, pending: 2, resolved: 3, closed: 3 };
const CUST_STATUS = {
  new: 'ได้รับเรื่องแล้ว', assigned: 'มอบหมายช่างแล้ว', in_progress: 'ช่างกำลังแก้ไข',
  pending: 'รอดำเนินการ', resolved: 'รอคุณยืนยันงาน', closed: 'เสร็จสิ้น',
};

const CATEGORIES = {
  printer: { label: 'เครื่องพิมพ์', icon: 'print' },
  network: { label: 'อินเทอร์เน็ต/เครือข่าย', icon: 'wifi' },
  account: { label: 'บัญชี/รหัสผ่าน', icon: 'key' },
  install: { label: 'ติดตั้งเครื่อง', icon: 'pc' },
  repair:  { label: 'ซ่อมอุปกรณ์', icon: 'tool' },
  cctv:    { label: 'กล้องวงจรปิด', icon: 'cctv' },
  other:   { label: 'อื่น ๆ', icon: 'help' },
};

const ROLE_LABEL = { customer: 'ลูกค้า', technician: 'ช่างเทคนิค', team_leader: 'หัวหน้าทีม', admin: 'ผู้ดูแลระบบ' };
const ROLE_ORDER = ['customer', 'technician', 'team_leader', 'admin'];
const ROLE_META = {
  customer: {
    icon: 'user', goal: 'แจ้งปัญหา ติดตามงาน และเซ็นรับงาน',
    can: ['แจ้งปัญหา (พิมพ์ / พูด / แนบรูป)', 'ติดตามว่าช่างถึงไหนแล้ว', 'เซ็นรับงานและให้คะแนน'],
    cannot: ['เห็นบันทึกภายใน / Work log', 'เปลี่ยนสถานะงาน', 'เห็นตำแหน่งช่าง'],
  },
  technician: {
    icon: 'tool', goal: 'ทำงานที่ได้รับมอบหมายให้เสร็จ',
    can: ['เปลี่ยนสถานะงานของตัวเอง', 'ออกใบรายงานเมื่อทำเสร็จ', 'ให้ลูกค้าเซ็นรับงานหน้างาน', 'บันทึก Work log'],
    cannot: ['เห็นงานของช่างคนอื่น', 'มอบหมายงาน', 'จัดการพาร์ทเนอร์'],
  },
  team_leader: {
    icon: 'team', goal: 'กระจายงานและดูแลทีมให้ทันเวลา',
    can: ['เห็นงานทั้งหมด', 'มอบหมาย / ย้ายงาน', 'จัดการพาร์ทเนอร์และสถานที่', 'ดู / พิมพ์รายงานสรุป'],
    cannot: ['จัดการผู้ใช้และสิทธิ์'],
  },
  admin: {
    icon: 'gear', goal: 'ดูแลระบบ ผู้ใช้ และสิทธิ์',
    can: ['เห็นงานทั้งหมด', 'จัดการพาร์ทเนอร์และสถานที่', 'ดู / พิมพ์รายงานสรุป', 'ดูผู้ใช้และตารางสิทธิ์'],
    cannot: ['ดูตำแหน่ง GPS ของช่าง (ความเป็นส่วนตัว)'],
  },
};

/* ลายเซ็นตัวอย่างของงานในอดีต */
const demoSig = d => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100"><path d="${d}" stroke="#1F2937" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

let tickets = [
  { id: 'T-1001', customer: 'C1', siteId: 'S1', location: 'ชั้น 3', subject: 'เครื่องพิมพ์ชั้น 3 ใช้งานไม่ได้', category: 'printer',
    priority: 'high', status: 'in_progress', assignee: 'tech1', version: 3,
    history: [
      { from: null, to: 'new', by: 'cust1', at: t(-180) },
      { from: 'new', to: 'assigned', by: 'lead1', at: t(-170) },
      { from: 'assigned', to: 'in_progress', by: 'tech1', at: t(-90) },
    ],
    comments: [
      { by: 'cust1', vis: 'public',   text: 'ปริ้นเตอร์ไม่ตัดกระดาษ แจ้งตั้งแต่เมื่อวาน', at: t(-179) },
      { by: 'tech1', vis: 'internal', text: 'เช็กแล้ว ลูกกลิ้งสึก ต้องสั่งอะไหล่', at: t(-100) },
    ],
    worklogs: [{ by: 'tech1', text: 'ตรวจเครื่อง 30 นาที พบลูกกลิ้งดึงกระดาษสึก', at: t(-95) }],
    missionId: 'M1', report: null },
  { id: 'T-1002', customer: 'C1', siteId: 'S1', location: 'ฝ่ายบัญชี', subject: 'ขอรีเซ็ตรหัสผ่าน VPN', category: 'account',
    priority: 'medium', status: 'resolved', assignee: 'tech2', version: 4,
    history: [
      { from: null, to: 'new', by: 'cust1', at: t(-4000) },
      { from: 'new', to: 'assigned', by: 'lead1', at: t(-3950) },
      { from: 'assigned', to: 'in_progress', by: 'tech2', at: t(-3900) },
      { from: 'in_progress', to: 'resolved', by: 'tech2', at: t(-2100), reason: 'รีเซ็ตรหัสผ่านและแจ้งผู้ใช้แล้ว' },
    ],
    comments: [{ by: 'tech2', vis: 'public', text: 'ดำเนินการรีเซ็ตรหัสผ่าน VPN เรียบร้อยแล้วครับ', at: t(-2100) }],
    worklogs: [{ by: 'tech2', text: 'รีเซ็ตรหัสผ่านใน AD และแจ้ง OTP ให้ลูกค้า', at: t(-2200) }],
    missionId: null,
    report: { no: `SR-${YEAR}-0003`, summary: 'รีเซ็ตรหัสผ่าน VPN ใน Active Directory และทดสอบเชื่อมต่อร่วมกับผู้ใช้สำเร็จ', parts: '', hours: 0.5, by: 'tech2', at: t(-2100), signoff: null } },
  { id: 'T-1003', customer: 'C2', siteId: 'S3', location: '', subject: 'เครือข่ายล่มทั้งสาขา', category: 'network',
    priority: 'urgent', status: 'new', assignee: null, version: 1,
    history: [{ from: null, to: 'new', by: 'system', at: t(-15) }],
    comments: [{ by: 'cust2', vis: 'public', text: 'เน็ตใช้งานไม่ได้ทั้งร้าน ด่วนมากค่ะ', at: t(-15) }],
    worklogs: [], missionId: null, report: null },
  { id: 'T-1004', customer: 'C1', siteId: 'S2', location: 'ห้องธุรการ', subject: 'ติดตั้งคอมพิวเตอร์ใหม่ 3 เครื่อง', category: 'install',
    priority: 'low', status: 'pending', assignee: 'tech1', version: 2,
    history: [
      { from: null, to: 'new', by: 'cust1', at: t(-900) },
      { from: 'new', to: 'assigned', by: 'lead1', at: t(-880) },
      { from: 'assigned', to: 'in_progress', by: 'tech1', at: t(-500) },
      { from: 'in_progress', to: 'pending', by: 'tech1', at: t(-60), reason: 'รออุปกรณ์จากคลังสินค้า' },
    ],
    comments: [], worklogs: [], missionId: null, report: null },
  /* งานที่ปิดแล้ว (มีลายเซ็น) สำหรับรายงาน */
  { id: 'T-0998', customer: 'C1', siteId: 'S1', location: 'ห้องประชุมใหญ่', subject: 'โปรเจกเตอร์ห้องประชุมไม่มีสัญญาณภาพ', category: 'repair',
    priority: 'medium', status: 'closed', assignee: 'tech1', version: 6,
    history: [
      { from: null, to: 'new', by: 'cust1', at: t(-5 * DAY) },
      { from: 'new', to: 'assigned', by: 'lead1', at: t(-5 * DAY + 600) },
      { from: 'assigned', to: 'in_progress', by: 'tech1', at: t(-4 * DAY) },
      { from: 'in_progress', to: 'resolved', by: 'tech1', at: t(-4 * DAY + 5400), reason: 'เปลี่ยนสาย HDMI' },
      { from: 'resolved', to: 'closed', by: 'cust1', at: t(-4 * DAY + 6000), reason: 'ลูกค้าลงนามรับงาน' },
    ],
    comments: [], worklogs: [{ by: 'tech1', text: 'ไล่สายสัญญาณ พบสาย HDMI ใต้พื้นชำรุด', at: t(-4 * DAY + 3000) }], missionId: null,
    report: { no: `SR-${YEAR}-0001`, summary: 'ตรวจสอบระบบภาพ พบสาย HDMI ใต้พื้นชำรุด เปลี่ยนสายใหม่และทดสอบการแสดงผลจากโน้ตบุ๊ก 3 เครื่องเรียบร้อย', parts: 'สาย HDMI 15 ม. 1 เส้น', hours: 1.5, by: 'tech1', at: t(-4 * DAY + 5400),
      signoff: { name: 'สมหญิง ใจดี', position: 'เจ้าหน้าที่ไอที', via: 'app', by: 'cust1', at: t(-4 * DAY + 6000), sig: demoSig('M15 70 C 35 20, 55 85, 80 45 S 120 75, 150 35 S 205 80, 235 40 L 285 55') } },
    rating: { score: 5, comment: 'ช่างมาตรงเวลา อธิบายเข้าใจง่าย', by: 'cust1', at: t(-4 * DAY + 6100) } },
  { id: 'T-0999', customer: 'C2', siteId: 'S4', location: 'จุดชำระเงิน 2', subject: 'เครื่อง POS ค้าง', category: 'repair',
    priority: 'high', status: 'closed', assignee: 'tech2', version: 6,
    history: [
      { from: null, to: 'new', by: 'cust2', at: t(-2 * DAY) },
      { from: 'new', to: 'assigned', by: 'lead1', at: t(-2 * DAY + 300) },
      { from: 'assigned', to: 'in_progress', by: 'tech2', at: t(-2 * DAY + 3600) },
      { from: 'in_progress', to: 'resolved', by: 'tech2', at: t(-2 * DAY + 9000), reason: 'ติดตั้งไดรเวอร์ใหม่' },
      { from: 'resolved', to: 'closed', by: 'tech2', at: t(-2 * DAY + 9300), reason: 'ลูกค้าลงนามรับงานหน้างาน' },
    ],
    comments: [], worklogs: [], missionId: null,
    report: { no: `SR-${YEAR}-0002`, summary: 'เครื่อง POS ค้างจากไดรเวอร์เครื่องพิมพ์ใบเสร็จ ติดตั้งไดรเวอร์เวอร์ชันล่าสุดและทดสอบขายจริง 5 รายการ', parts: '', hours: 1.5, by: 'tech2', at: t(-2 * DAY + 9000),
      signoff: { name: 'กิตติ ทองดี', position: 'ผู้จัดการสาขา', via: 'onsite', by: 'tech2', at: t(-2 * DAY + 9300), sig: demoSig('M20 60 C 50 30, 70 30, 85 60 S 110 90, 130 50 C 150 20, 175 75, 200 55 S 250 30, 280 50') } },
    rating: { score: 4, comment: '', by: 'tech2', via: 'onsite', at: t(-2 * DAY + 9350) } },
];

/* รูปภาพแนบ: เก็บเป็น blob URL (ย่อขนาดแล้ว) อ้างอิงด้วย id เพื่อไม่ให้ HTML หนัก */
const PHOTOS = {};
let nextPhotoNo = 1;
const RATE_LABEL = ['', 'ต้องปรับปรุง', 'พอใช้', 'ปานกลาง', 'ดี', 'ดีมาก'];
tickets.push({ id: 'T-0997', type: 'complaint', customer: 'C1', siteId: 'S2', location: '', subject: 'ช่างมาช้ากว่านัดเกือบ 2 ชั่วโมง ไม่มีใครโทรแจ้ง', category: 'other',
  priority: 'high', status: 'new', assignee: null, version: 1,
  history: [{ from: null, to: 'new', by: 'cust1', at: t(-3600) }],
  comments: [{ by: 'cust1', vis: 'public', text: 'นัดไว้ 9 โมง ช่างมาเกือบ 11 โมง อยากให้โทรแจ้งก่อนถ้าจะมาช้า', at: t(-3600) }],
  worklogs: [], missionId: null, report: null });
let nextTicketNo = 1005;

/* โปรเจกต์ (งานติดตั้งหลายขั้นตอน) — ความคืบหน้า = งานย่อยที่เสร็จ / ทั้งหมด */
let projects = [
  { id: 'PJ1', name: 'ติดตั้งกล้องวงจรปิด 16 จุด', category: 'cctv', customer: 'C1', siteId: 'S2', owner: 'tech3', due: t(10 * DAY), createdAt: t(-6 * DAY),
    tasks: [{ text: 'สำรวจหน้างานและวางตำแหน่งกล้อง', done: true }, { text: 'เดินสาย LAN / ไฟ', done: true }, { text: 'ติดตั้งกล้อง 16 ตัว', done: false }, { text: 'ตั้งค่า NVR และแอปดูภาพ', done: false }, { text: 'ส่งมอบและสอนใช้งาน', done: false }] },
  { id: 'PJ2', name: 'ติดตั้ง Wi-Fi ทั้งสาขา', category: 'network', customer: 'C2', siteId: 'S4', owner: 'tech2', due: t(4 * DAY), createdAt: t(-3 * DAY),
    tasks: [{ text: 'สำรวจสัญญาณ', done: true }, { text: 'ติดตั้ง Access Point 4 ตัว', done: true }, { text: 'ทดสอบสัญญาณทุกจุด', done: true }, { text: 'ส่งมอบ', done: false }] },
];
let nextProjectNo = 3;

/* การแจ้งเตือน: ส่งถึงผู้ใช้แต่ละคน (to) — แสดงในกระดิ่ง + แจ้งเตือนของเครื่องเมื่อคนนั้นเปิดแอป */
let notifs = [
  { id: 'N1', to: 'lead1', title: 'งานใหม่ · ด่วนมาก', body: 'เครือข่ายล่มทั้งสาขา — ร้านสะดวกซื้อ XYZ', ticketId: 'T-1003', at: t(-15), read: false },
  { id: 'N2', to: 'admin1', title: 'งานใหม่ · ด่วนมาก', body: 'เครือข่ายล่มทั้งสาขา — ร้านสะดวกซื้อ XYZ', ticketId: 'T-1003', at: t(-15), read: false },
];
let nextNotifNo = 3;

/* คำขอสมัครใช้งานจากลิงก์ชวน (?join=รหัสบริษัท) — รอตัวแทนบริษัทอนุมัติ */
let joinRequests = [];
let nextJoinNo = 1, nextUserNo = 1;
let nextReportNo = 4;

let missions = {
  M1: { id: 'M1', ticketId: 'T-1001', technician: 'tech1', status: 'assigned',
        dest: 'สำนักงานใหญ่ ชั้น 3', siteId: 'S1', startLL: [13.7000, 100.5230], posLL: [13.7000, 100.5230], session: null },
};

let auditLog = [
  { at: t(-170), actor: 'ประภาส', role: 'team_leader', action: 'มอบหมาย T-1001', detail: '→ ชาติชาย' },
  { at: t(-90),  actor: 'ชาติชาย', role: 'technician', action: 'เปลี่ยนสถานะ T-1001', detail: '→ กำลังดำเนินการ' },
];
function logAudit(u, action, detail) { auditLog.unshift({ at: new Date(), actor: u.name, role: u.role, action, detail }); }

/* ตัวช่วยอ่านข้อมูล */
const custName = id => customers[id]?.name || '-';
const siteOf = tk => customers[tk.customer]?.sites.find(s => s.id === tk.siteId);
const siteLabel = tk => { const s = siteOf(tk); return (s ? s.name : '-') + (tk.location ? ` · ${tk.location}` : ''); };
const siteById = id => allSites().find(s => s.id === id);
const allSites = () => Object.values(customers).flatMap(c => c.sites.map(s => ({ ...s, customer: c.id })));
