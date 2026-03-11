import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

// ── PRODUCT DATA (será substituído pela API real) ──
const PRODUCTS = [
  { id:1, asin:'B09XS7JWHH', brand:'Sony', title:'Sony WH-1000XM5 Fone Sem Fio com Cancelamento de Ruído', img:'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SX425_.jpg', price:'R$ 1.499,90', old:'R$ 2.599,00', disc:'-42%', score:94, stars:5, reviews:'12.453', coupon:'SONY10', badge:'hist', badgeLabel:'Menor preço', save:'Economize R$ 1.099,10' },
  { id:2, asin:'B0C7G9GKJL', brand:'Dell', title:'Dell XPS 13 Plus Intel i7 16GB 512GB SSD', img:'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX425_.jpg', price:'R$ 4.299,90', old:'R$ 6.999,00', disc:'-52%', score:91, stars:5, reviews:'8.291', badge:'hot', badgeLabel:'Trending', save:'Economize R$ 2.699,10' },
  { id:3, asin:'B0C8VMJD91', brand:'Sony', title:'PlayStation 5 Slim Bundle + 2 Jogos', img:'https://m.media-amazon.com/images/I/619nApKCJeL._AC_SX425_.jpg', price:'R$ 2.799,90', old:'R$ 4.199,00', disc:'-45%', score:88, stars:5, reviews:'5.847', badge:'flash', badgeLabel:'⚡ Flash', save:'Economize R$ 1.399,10' },
  { id:4, asin:'B0CHLT3VL8', brand:'Apple', title:'iPhone 15 128GB Preto Desbloqueado Nacional', img:'https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SX425_.jpg', price:'R$ 3.799,90', old:'R$ 4.999,00', disc:'-31%', score:85, stars:5, reviews:'21.847', badge:'prime', badgeLabel:'✦ prime', save:'Economize R$ 1.199,10' },
  { id:5, asin:'B00FLYWNYQ', brand:'Instant Pot', title:'Instant Pot Duo 7-em-1 Panela de Pressão 6L', img:'https://m.media-amazon.com/images/I/71cjjfBGHHL._AC_SX425_.jpg', price:'R$ 399,90', old:'R$ 599,00', disc:'-35%', score:82, stars:5, reviews:'94.312', badge:'prime', badgeLabel:'✦ prime', save:'Economize R$ 199,10' },
]

const TRENDING = [
  { id:6, title:'Apple Watch Series 9 GPS 41mm', img:'https://m.media-amazon.com/images/I/71+APsSYKFL._AC_SX200_.jpg', price:'R$ 1.899,90', disc:'-25%' },
  { id:7, title:'Monitor LG 27" 4K IPS 60Hz', img:'https://m.media-amazon.com/images/I/71oL4Hk4Q9L._AC_SX200_.jpg', price:'R$ 1.849,90', disc:'-40%' },
  { id:8, title:'Kindle Paperwhite 16GB', img:'https://m.media-amazon.com/images/I/71MgJe2p9NL._AC_SX200_.jpg', price:'R$ 649,90', disc:'-31%' },
  { id:9, title:'GoPro HERO12 Black', img:'https://m.media-amazon.com/images/I/61GbNiKOKEL._AC_SX200_.jpg', price:'R$ 1.799,90', disc:'-33%' },
  { id:10, title:'Echo Dot 5ª Geração', img:'https://m.media-amazon.com/images/I/61U2zyM-7LL._AC_SX200_.jpg', price:'R$ 199,90', disc:'-43%' },
  { id:11, title:'Anker PowerCore 26800mAh', img:'https://m.media-amazon.com/images/I/81Us7VxKP6L._AC_SX200_.jpg', price:'R$ 249,90', disc:'-28%' },
  { id:12, title:'Bowflex SelectTech 552', img:'https://m.media-amazon.com/images/I/710rTpZMCBL._AC_SX200_.jpg', price:'R$ 1.499,90', disc:'-33%' },
]

type User = { name: string; email: string; role: 'admin' | 'user' } | null

export default function Home() {
  const [page, setPage] = useState<'home'|'product'|'category'|'admin'>('home')
  const [user, setUser] = useState<User>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'login'|'register'>('login')
  const [adminTab, setAdminTab] = useState<'dashboard'|'users'|'products'>('dashboard')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [couponCopied, setCouponCopied] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const [adminUsers, setAdminUsers] = useState([
    { name:'Admin Principal', email:'admin@ofertamax.com', role:'admin' as const },
  ])
  const [regularUsers] = useState([
    { name:'Carlos Ferreira', email:'carlos@email.com', role:'user' as const },
    { name:'Maria Santos', email:'maria@email.com', role:'user' as const },
    { name:'Paulo Lima', email:'paulo@email.com', role:'user' as const },
  ])
  const [promotedUsers, setPromotedUsers] = useState<string[]>([])
  const [timer, setTimer] = useState({ h:4, m:37, s:22 })
  const [priceVal, setPriceVal] = useState(5000)
  const [scoreVal, setScoreVal] = useState(60)
  const [activeCat, setActiveCat] = useState('all')
  const [mainImg, setMainImg] = useState('https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg')
  const [activeThumb, setActiveThumb] = useState(0)
  const profileRef = useRef<HTMLDivElement>(null)

  // Timer countdown
  useEffect(() => {
    const int = setInterval(() => {
      setTimer(t => {
        let {h,m,s} = t
        if(s>0) return {h,m,s:s-1}
        if(m>0) return {h,m:m-1,s:59}
        if(h>0) return {h:h-1,m:59,s:59}
        return {h:0,m:0,s:0}
      })
    }, 1000)
    return () => clearInterval(int)
  }, [])

  // Close profile on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const nav = (p: typeof page) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); setProfileOpen(false) }
  const pad = (n:number) => String(n).padStart(2,'0')

  const doLogin = () => {
    if (!loginEmail || !loginPass) return alert('Preencha email e senha.')
    const isAdmin = loginEmail === 'admin@ofertamax.com'
    setUser({ name: isAdmin ? 'Admin Principal' : 'Usuário Demo', email: loginEmail, role: isAdmin ? 'admin' : 'user' })
    setModalOpen(false); setLoginEmail(''); setLoginPass('')
  }

  const doRegister = () => {
    if (!regName || !regEmail || !regPass) return alert('Preencha todos os campos.')
    if (regPass.length < 8) return alert('Senha mínimo 8 caracteres.')
    setUser({ name: regName, email: regEmail, role: 'user' })
    setModalOpen(false); setRegName(''); setRegEmail(''); setRegPass('')
  }

  const toggleFav = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code).catch(()=>{})
    setCouponCopied(code)
    setTimeout(() => setCouponCopied(''), 2000)
  }

  const addAdmin = () => {
    if (!newAdminName || !newAdminEmail || !newAdminPass) { setAdminMsg('err:Preencha todos os campos.'); return }
    setAdminUsers(prev => [...prev, { name:newAdminName, email:newAdminEmail, role:'admin' }])
    setAdminMsg(`ok:Admin "${newAdminName}" criado com sucesso!`)
    setNewAdminName(''); setNewAdminEmail(''); setNewAdminPass('')
    setTimeout(() => setAdminMsg(''), 4000)
  }

  const promoteUser = (email: string) => {
    if (!confirm(`Promover este usuário a administrador?`)) return
    const u = regularUsers.find(u => u.email === email)
    if (!u) return
    setAdminUsers(prev => [...prev, { name:u.name, email:u.email, role:'admin' }])
    setPromotedUsers(prev => [...prev, email])
  }

  const THUMBS = [
    'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
  ]

  return (
    <>
      <Head>
        <title>OfertaMax — Melhores Ofertas Amazon</title>
        <meta name="description" content="Encontre as melhores ofertas da Amazon. IA verifica e ranqueia as promoções em tempo real." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="OfertaMax — Melhores Ofertas Amazon" />
        <meta property="og:description" content="IA verifica as melhores promoções da Amazon em tempo real." />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-row1">
          <div className="logo" onClick={() => nav('home')}>
            <div className="logo-mark">O</div>
            <span className="logo-name"><span className="o">Oferta</span>Max</span>
          </div>
          <div className="search-box">
            <input className="search-input" type="text" placeholder="Buscar ofertas na Amazon..." />
            <button className="search-btn" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
          <div className="nav-actions">
            <button className="nav-icon-btn" aria-label="Favoritos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button className="nav-icon-btn" aria-label="Alertas">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className="notif-dot"></span>
            </button>
            <div className="profile-wrap" ref={profileRef}>
              <button className="profile-btn" onClick={() => setProfileOpen(o => !o)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {user ? user.name.split(' ')[0] : 'Entrar'}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className={`profile-dropdown${profileOpen ? ' open' : ''}`}>
                {!user ? (
                  <div style={{padding:'16px'}}>
                    <p style={{fontSize:'13px',color:'var(--text2)',marginBottom:'12px',lineHeight:1.5}}>Faça login para acessar favoritos e alertas de preço.</p>
                    <button className="form-btn" onClick={() => { setModalOpen(true); setModalTab('login'); setProfileOpen(false) }}>Entrar na conta</button>
                    <p style={{fontSize:'11px',color:'var(--text3)',textAlign:'center',marginTop:'8px'}}>Novo? <span style={{color:'var(--orange)',cursor:'pointer'}} onClick={() => { setModalOpen(true); setModalTab('register'); setProfileOpen(false) }}>Criar conta grátis</span></p>
                  </div>
                ) : (
                  <>
                    <div className="pd-user">
                      <div className="pd-avatar">{user.name[0]}</div>
                      <div>
                        <div className="pd-name">{user.name}</div>
                        <div className="pd-email">{user.email}</div>
                        {user.role === 'admin' && <div className="pd-admin-badge">⚔️ Admin</div>}
                      </div>
                    </div>
                    <div className="pd-items">
                      <button className="pd-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>Meus Favoritos</button>
                      <button className="pd-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>Alertas de Preço</button>
                      <div className="pd-sep"/>
                      {user.role === 'admin' && (
                        <button className="pd-item admin-link" onClick={() => { nav('admin'); setProfileOpen(false) }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                          Painel Admin
                        </button>
                      )}
                      <div className="pd-sep"/>
                      <button className="pd-item pd-logout" onClick={() => { setUser(null); setProfileOpen(false) }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Category bar */}
        <div className="cat-bar">
          {[
            ['all','🔥 Todas as Ofertas'],['eletronicos','💻 Eletrônicos'],['games','🎮 Games'],
            ['audio','🎧 Áudio'],['celulares','📱 Celulares'],['wearables','⌚ Wearables'],
            ['casa','🏠 Casa & Cozinha'],['esportes','🏋️ Esportes'],['livros','📚 Livros'],['beleza','💄 Beleza'],
          ].map(([id,label]) => (
            <button key={id} className={`cat-tab${activeCat===id?' active':''}`} onClick={() => { setActiveCat(id); if(id!=='all') nav('category') }}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════ HOME ══════════ */}
      {page === 'home' && (
        <>
          {/* HERO */}
          <div className="hero">
            <div className="hero-wrap">
              <div>
                <div className="hero-eyebrow"><span className="hero-pulse"></span> IA detectou 847 novas ofertas hoje</div>
                <h1>Melhores ofertas<br/>da Amazon, <span className="accent">agora</span></h1>
                <p className="hero-sub">Nossa IA analisa milhares de produtos por hora. Só exibimos promoções reais, verificadas com histórico de preço.</p>
                <div className="hero-btns">
                  <button className="hero-btn primary" onClick={() => nav('category')}>🔥 Ver todas as ofertas</button>
                  <button className="hero-btn secondary" onClick={() => { setModalOpen(true); setModalTab('login') }}>🔔 Criar alerta de preço</button>
                </div>
                <div className="hero-stats">
                  <div><div className="hst-num"><span>12</span>.847</div><div className="hst-lbl">Ofertas ativas</div></div>
                  <div><div className="hst-num">R$<span>4,2M</span></div><div className="hst-lbl">Economizados hoje</div></div>
                  <div><div className="hst-num"><span>97</span>%</div><div className="hst-lbl">Verificadas</div></div>
                </div>
              </div>
              <div className="hero-right">
                <div className="hero-tag">⚡ Top ofertas agora</div>
                {PRODUCTS.slice(0,3).map((p,i) => (
                  <div key={p.id} className={`fc${i===0?' top':''}`} onClick={() => nav('product')}>
                    <div className="fc-img"><img src={p.img} alt={p.title} onError={(e:any) => e.target.style.opacity='0'} /></div>
                    <div className="fc-info">
                      <span className="fc-badge">{i===0?'🏆 #1':p.disc}</span>
                      <div className="fc-title">{p.title}</div>
                      <div className="fc-price"><span className="fc-now">{p.price}</span><span className="fc-old">{p.old}</span></div>
                    </div>
                    <div className="fc-score"><span className="sn">{p.score}</span><span className="sl">SCORE</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="content">
            {/* DEAL OF THE DAY */}
            <div className="section">
              <div className="dotd-header">
                <div className="dotd-header-title">⚡ Oferta do Dia</div>
                <div className="dotd-timer">
                  Termina em:
                  <div className="timer-unit"><span className="timer-n">{pad(timer.h)}</span><span className="timer-l">HRS</span></div>
                  <span className="timer-sep">:</span>
                  <div className="timer-unit"><span className="timer-n">{pad(timer.m)}</span><span className="timer-l">MIN</span></div>
                  <span className="timer-sep">:</span>
                  <div className="timer-unit"><span className="timer-n">{pad(timer.s)}</span><span className="timer-l">SEG</span></div>
                </div>
              </div>
              <div className="dotd-body" onClick={() => nav('product')}>
                <div className="dotd-img-wrap">
                  <div className="dotd-img-badges">
                    <span className="pbdg pb-disc">-42% OFF</span>
                    <span className="pbdg pb-hist" style={{marginTop:4}}>🏷 MENOR PREÇO</span>
                    <span className="pbdg pb-hot" style={{marginTop:4}}>+3.400 hoje</span>
                  </div>
                  <img src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg" alt="Sony WH-1000XM5" onError={(e:any) => e.target.style.opacity='0'} />
                </div>
                <div className="dotd-info">
                  <div className="dotd-eye"><span style={{width:8,height:8,background:'var(--red)',borderRadius:'50%',display:'inline-block'}}></span>Verificado pela IA — Score 94/100</div>
                  <h2 className="dotd-title">Sony WH-1000XM5 Headphone Premium com Cancelamento de Ruído Ativo</h2>
                  <p className="dotd-desc">Melhor headphone sem fio do mercado. Cancelamento de ruído líder de categoria, 30h de bateria, tecnologia LDAC.</p>
                  <div className="dotd-price-row">
                    <span className="dotd-price"><span className="sym">R$</span>1.499<span style={{fontSize:20}}>,90</span></span>
                    <span className="dotd-old">R$ 2.599,00</span>
                    <span className="dotd-save">-42% (R$ 1.099,10 OFF)</span>
                  </div>
                  <div className="score-row"><div className="score-track"><div className="score-fill" style={{width:'94%'}}></div></div><span className="score-label">Score IA: 94/100</span></div>
                  <div className="stock-row">Estoque limitado <div className="stock-bar"><div className="stock-fill" style={{width:'68%'}}></div></div> 68% vendido</div>
                  <div className="dotd-cta">
                    <button className="dotd-btn p" onClick={(e) => { e.stopPropagation(); nav('product') }}>🛒 Ver na Amazon</button>
                    <button className="dotd-btn s" onClick={(e) => { e.stopPropagation(); }}>♡ Favoritar</button>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIORES DESCONTOS */}
            <div className="section">
              <div className="section-card">
                <div className="sec-hdr">
                  <div>
                    <h2>💸 Maiores descontos</h2>
                    <p style={{fontSize:12,color:'var(--text3)',marginTop:3}}>Acima de 40% OFF — verificados pela IA</p>
                  </div>
                  <button className="sec-link" onClick={() => nav('category')}>Ver todos →</button>
                </div>
                <div className="pgrid g5">
                  {PRODUCTS.map(p => (
                    <div key={p.id} className="pcard fadein" onClick={() => nav('product')}>
                      <div className="pcard-img">
                        <div className="pcard-badges">
                          <span className="pbdg pb-disc">{p.disc}</span>
                          {p.badge === 'hist' && <span className="pbdg pb-hist" style={{marginTop:3}}>{p.badgeLabel}</span>}
                          {p.badge === 'hot' && <span className="pbdg pb-hot" style={{marginTop:3}}>{p.badgeLabel}</span>}
                          {p.badge === 'flash' && <span className="pbdg pb-flash" style={{marginTop:3}}>{p.badgeLabel}</span>}
                          {p.badge === 'prime' && <span className="pbdg pb-prime" style={{marginTop:3}}>{p.badgeLabel}</span>}
                        </div>
                        <button className={`wish-btn${favorites.has(p.id)?' on':''}`} onClick={(e) => toggleFav(p.id,e)} aria-label="Favoritar">
                          {favorites.has(p.id)?'♥':'♡'}
                        </button>
                        <img src={p.img} alt={p.title} onError={(e:any) => e.target.style.opacity='0'} />
                      </div>
                      <div className="pcard-body">
                        <div className="pcard-brand">{p.brand}</div>
                        <div className="pcard-title">{p.title}</div>
                        <div className="pcard-stars">
                          <div className="stars">{Array(5).fill(0).map((_,i) => <span key={i} className={i<p.stars?'star-on':'star-off'}>★</span>)}</div>
                          <span className="star-count">{p.reviews}</span>
                        </div>
                        <div className="pcard-pricing">
                          <div className="price-line"><span className="price-now">{p.price}</span><span className="price-old">{p.old}</span></div>
                          <span className="price-save">{p.save}</span>
                          {p.coupon && (
                            <div className="coup-strip">🏷️ <span className="coup-txt">Cupom:</span>
                              <span className="coup-code" onClick={(e) => { e.stopPropagation(); copyCoupon(p.coupon!) }}>
                                {couponCopied===p.coupon?'✅ COPIADO':p.coupon}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="score-mini"><div className="score-mini-track"><div className="score-mini-fill" style={{width:`${p.score}%`}}></div></div><span className="score-mini-lbl">{p.score}</span></div>
                        <button className="card-cta">🛒 Ver na Amazon</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRENDING SCROLL */}
            <div className="section">
              <div className="section-card">
                <div className="sec-hdr"><div><h2>📈 Trending agora</h2><p style={{fontSize:12,color:'var(--text3)',marginTop:3}}>Mais clicados nas últimas 6 horas</p></div></div>
                <div className="hscroll">
                  {TRENDING.map(p => (
                    <div key={p.id} className="hsc" onClick={() => nav('product')}>
                      <div className="hsc-img"><img src={p.img} alt={p.title} onError={(e:any) => e.target.style.opacity='0'} /></div>
                      <div className="hsc-body"><div className="hsc-title">{p.title}</div><div className="hsc-price">{p.price}</div><div className="hsc-disc">{p.disc} OFF</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="footer-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑ Voltar ao topo</div>
            <div className="footer-grid">
              <div className="footer-col"><h4>OfertaMax</h4><a>Sobre nós</a><a>Como funciona</a><a>Blog</a></div>
              <div className="footer-col"><h4>Explorar</h4><a onClick={() => nav('home')}>Todas as ofertas</a><a>Oferta do dia</a><a>Trending</a></div>
              <div className="footer-col"><h4>Conta</h4><a onClick={() => { setModalOpen(true); setModalTab('login') }}>Entrar</a><a onClick={() => { setModalOpen(true); setModalTab('register') }}>Criar conta</a><a>Favoritos</a></div>
              <div className="footer-col"><h4>Legal</h4><a>Privacidade</a><a>Termos</a><a>Divulgação afiliado</a></div>
            </div>
            <div className="footer-bottom"><p>© 2025 OfertaMax. Como Associado Amazon, recebemos comissão em compras qualificadas. O preço que você paga permanece o mesmo.</p></div>
          </footer>
        </>
      )}

      {/* ══════════ PRODUCT PAGE ══════════ */}
      {page === 'product' && (
        <div style={{background:'var(--bg)',minHeight:'100vh'}}>
          <div className="prod-page-wrap">
            <div className="breadcrumb">
              <button className="bc-a" onClick={() => nav('home')}>OfertaMax</button><span className="bc-sep">›</span>
              <button className="bc-a" onClick={() => nav('category')}>Eletrônicos</button><span className="bc-sep">›</span>
              <button className="bc-a">Áudio</button><span className="bc-sep">›</span>
              <span>Sony WH-1000XM5</span>
            </div>
            <div className="prod-grid">
              {/* Image panel */}
              <div className="img-panel">
                <div className="img-main">
                  <div className="img-badges">
                    <span className="pbdg pb-disc">-42% OFF</span>
                    <span className="pbdg pb-hist" style={{marginTop:5}}>Menor preço 90d</span>
                    <span className="pbdg pb-hot" style={{marginTop:5}}>Trending</span>
                  </div>
                  <img src={mainImg} alt="Sony WH-1000XM5" onError={(e:any) => e.target.style.opacity='0'} />
                </div>
                <div className="img-thumbs">
                  {THUMBS.map((src,i) => (
                    <div key={i} className={`thumb${activeThumb===i?' active':''}`} onClick={() => { setMainImg(src); setActiveThumb(i) }}>
                      <img src={src.replace('_SL1500_','_SX200_')} alt="" onError={(e:any) => e.target.style.opacity='0'} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Info panel */}
              <div className="info-panel">
                <button className="prod-brand-link">Visite a loja da Sony</button>
                <h1 className="prod-title-full">Sony WH-1000XM5 Fone de Ouvido Sem Fio com Cancelamento de Ruído, Bluetooth, 30h Bateria — Preto</h1>
                <div className="prod-stars-row">
                  <div className="stars">{Array(5).fill(0).map((_,i) => <span key={i} className="star-on" style={{fontSize:15}}>★</span>)}</div>
                  <span style={{color:'var(--orange)',fontSize:14,fontWeight:600}}>4,8</span>
                  <span style={{fontSize:13,color:'var(--orange)',cursor:'pointer'}}>12.453 avaliações</span>
                  <span style={{fontSize:12,color:'var(--green)'}}>✦ #1 em Headphones</span>
                </div>
                <div className="price-block">
                  <div style={{fontSize:12,color:'var(--text3)',marginBottom:4}}>Preço: <span style={{textDecoration:'line-through'}}>R$ 2.599,00</span> <span style={{color:'var(--red)',fontWeight:600}}>(-42%)</span></div>
                  <div className="main-price">R$ 1.499,90</div>
                  <span className="save-tag">✅ Economize R$ 1.099,10</span>
                  <div style={{fontSize:12,color:'var(--text3)'}}>ou R$ 124,99/mês em 12x sem juros</div>
                  <span className="pbdg pb-prime" style={{width:'fit-content',marginTop:6}}>✦ prime Entrega GRÁTIS amanhã</span>
                  <div className="score-big-row">
                    <div className="score-big-lbl">Score IA desta oferta</div>
                    <div className="score-big-bar"><div className="sbt"><div className="sbf" style={{width:'94%'}}></div></div><span className="sbn">94 / 100</span></div>
                  </div>
                </div>
                <div className="coup-block">
                  <span className="code" onClick={() => copyCoupon('SONY10')}>{couponCopied==='SONY10'?'✅ COPIADO':'SONY10'}</span>
                  <span className="hint">Cupom — 10% adicional no checkout</span>
                </div>
                <ul className="feat-list">
                  <li><strong>Cancelamento de ruído líder:</strong> 8 microfones e 2 processadores dedicados</li>
                  <li><strong>30 horas de bateria:</strong> 3 min de carga = 3 horas de música</li>
                  <li><strong>Qualidade de som premium:</strong> Suporte a LDAC, 3x mais dados</li>
                  <li><strong>Conforto superior:</strong> 250g com almofadas de espuma macia</li>
                  <li><strong>Assistente de voz:</strong> Google Assistant e Alexa integrados</li>
                </ul>
                <div className="ai-box">
                  <div className="ai-title">🤖 Análise IA — Score 94/100</div>
                  <p className="ai-text">Produto no <strong>menor preço dos últimos 90 dias</strong>. 42% de desconto + 12.000 avaliações com nota 4,8. Recomendamos compra imediata — este preço dura em média 48h.</p>
                </div>
                <div className="vote-row">
                  <button className="vote-btn">👍 Boa oferta (1.284)</button>
                  <button className="vote-btn" style={{color:'var(--red)'}}>👎 32</button>
                  <button className="vote-btn">♡ Favoritar</button>
                </div>
              </div>
              {/* Buy box */}
              <div className="buy-box">
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:'var(--white)',marginBottom:6}}>R$ 1.499,90</div>
                <div style={{fontSize:13,color:'var(--text3)',marginBottom:8}}>ou 12x de R$ 124,99 s/ juros</div>
                <div style={{color:'var(--green)',fontSize:14,marginBottom:10}}>✓ Em estoque</div>
                <div className="prod-cta-col">
                  <button className="prod-btn pb-primary">🛒 Ver oferta na Amazon</button>
                  <button className="prod-btn pb-secondary">♡ Adicionar à lista</button>
                </div>
                <div className="bb-secure">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Transação segura — Amazon
                </div>
                <p style={{fontSize:10,color:'var(--text3)',marginTop:8,lineHeight:1.5,textAlign:'center'}}>* Como Associado Amazon, recebemos comissão. O preço não muda para você.</p>
              </div>
            </div>

            {/* Price History */}
            <div className="info-section">
              <div className="is-head">📈 Histórico de Preço</div>
              <div className="is-body">
                <div className="low-tag">🏆 Menor preço registrado em 90 dias! Aproveite agora.</div>
                <div className="price-stat-grid">
                  <div className="psg low"><div className="pv">R$ 1.499</div><div className="pl">Menor preço</div></div>
                  <div className="psg avg"><div className="pv">R$ 2.041</div><div className="pl">Preço médio</div></div>
                  <div className="psg high"><div className="pv">R$ 2.599</div><div className="pl">Maior preço</div></div>
                </div>
                <div className="chart-wrap">
                  <svg viewBox="0 0 600 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs><linearGradient id="og2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF9900" stopOpacity={0.2}/><stop offset="100%" stopColor="#FF9900" stopOpacity={0}/></linearGradient></defs>
                    <rect width="600" height="110" fill="#181818"/>
                    <path d="M0,60 C40,56 80,75 130,72 C180,69 220,40 270,43 C320,46 360,78 400,74 C440,70 480,52 530,48 C560,46 580,70 600,66 L600,110 L0,110 Z" fill="url(#og2)"/>
                    <path d="M0,60 C40,56 80,75 130,72 C180,69 220,40 270,43 C320,46 360,78 400,74 C440,70 480,52 530,48 C560,46 580,70 600,66" fill="none" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="0" y1="90" x2="600" y2="90" stroke="#00B86B" strokeWidth="1.5" strokeDasharray="8,5"/>
                    <text x="380" y="84" fontSize="11" fill="#00B86B" fontFamily="sans-serif" fontWeight="600">Preço atual: R$ 1.499</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="info-section">
              <div className="is-head">💬 Comentários <span style={{fontSize:13,fontWeight:400,color:'var(--text3)'}}>(48)</span></div>
              <div className="is-body">
                <div className="comment-form">
                  <textarea className="comment-textarea" placeholder="Compartilhe sua experiência... Ex: 'Comprei ontem, chegou hoje!'" />
                  <button className="comment-submit">Publicar</button>
                </div>
                <div className="comment-item">
                  <div className="cm-hdr"><div className="cm-avatar">C</div><div><div style={{display:'flex',alignItems:'center',gap:8}}><span className="cm-user">carlos_tech</span><span className="cm-verified">✓ Compra verificada</span></div><div className="cm-time">há 2 horas · SP</div></div><div className="stars" style={{marginLeft:'auto'}}><span className="star-on">★★★★★</span></div></div>
                  <div className="cm-text">Comprei ontem pelo Prime, chegou em 1 dia! Cancelamento de ruído é incrível. Vale cada centavo.</div>
                  <div className="cm-actions"><button className="cm-btn">👍 34</button><button className="cm-btn">💬 Responder</button></div>
                </div>
                <div className="comment-item">
                  <div className="cm-hdr"><div className="cm-avatar" style={{background:'var(--green)'}}>M</div><div><span className="cm-user">maria_shopping</span><div className="cm-time">há 4 horas</div></div></div>
                  <div className="cm-text">Preço confirmado! Com cupom SONY10 fica R$ 1.349,91. Ainda dá! 🔥</div>
                  <div className="cm-actions"><button className="cm-btn">👍 127</button><button className="cm-btn">💬 Responder</button></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CATEGORY PAGE ══════════ */}
      {page === 'category' && (
        <div style={{background:'var(--bg)',minHeight:'100vh'}}>
          <div className="cat-page-header">
            <div style={{maxWidth:1400,margin:'0 auto'}}>
              <div style={{fontSize:12,color:'var(--text3)',marginBottom:8}}>
                <span style={{color:'var(--orange)',cursor:'pointer'}} onClick={() => nav('home')}>OfertaMax</span> › {activeCat === 'all' ? 'Todas as ofertas' : activeCat.charAt(0).toUpperCase()+activeCat.slice(1)}
              </div>
              <h1>{activeCat === 'all' ? 'Todas as Ofertas' : activeCat.charAt(0).toUpperCase()+activeCat.slice(1)+' em Promoção'}</h1>
              <p style={{fontSize:12,color:'var(--text3)'}}>2.847 ofertas ativas · IA atualizou há 12 minutos</p>
            </div>
          </div>
          <div className="cat-layout">
            {/* Filter panel */}
            <div>
              <div className="filter-panel">
                <div className="fp-head">
                  <span>🎚 Filtros</span>
                  <button className="fp-clear" onClick={() => { setPriceVal(5000); setScoreVal(60) }}>Limpar</button>
                </div>
                <div className="fp-body">
                  <div className="filter-group">
                    <div className="fg-label">Desconto mínimo</div>
                    <div className="fg-options">
                      {['Qualquer desconto','20% ou mais','30% ou mais','50% ou mais'].map((opt,i) => (
                        <label key={i} className="fg-opt"><input type="radio" name="disc" defaultChecked={i===0} /> {opt}</label>
                      ))}
                    </div>
                  </div>
                  <div className="filter-group">
                    <div className="fg-label">Avaliação mínima</div>
                    <div className="fg-options">
                      <label className="fg-opt"><input type="checkbox" defaultChecked /> ★★★★★ 4.5 e acima</label>
                      <label className="fg-opt"><input type="checkbox" /> ★★★★ 4.0 e acima</label>
                    </div>
                  </div>
                  <div className="filter-group">
                    <div className="fg-label">Faixa de preço</div>
                    <input type="range" min={0} max={10000} value={priceVal} onChange={e => setPriceVal(+e.target.value)} />
                    <div className="range-row"><span>R$ 0</span><span style={{color:'var(--orange)',fontWeight:600}}>R$ {priceVal.toLocaleString('pt-BR')}</span><span>R$ 10.000</span></div>
                  </div>
                  <div className="filter-group">
                    <div className="fg-label">Score IA mínimo</div>
                    <input type="range" min={0} max={100} value={scoreVal} onChange={e => setScoreVal(+e.target.value)} />
                    <div className="range-row"><span>0</span><span style={{color:'var(--orange)',fontWeight:600}}>{scoreVal}/100</span><span>100</span></div>
                  </div>
                  <div className="filter-group">
                    <div className="fg-label">Tipo de oferta</div>
                    <div className="fg-chips">
                      {['🔥 Trending','🏷 Menor preço','🎟 Cupom','✦ Prime','⚡ Flash'].map(t => (
                        <button key={t} className="fg-chip">{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="alert-box">
                <div style={{fontSize:22}}>🔔</div>
                <h4 style={{fontSize:14,fontWeight:700,marginTop:6}}>Alerta de preço</h4>
                <p style={{fontSize:12,color:'var(--text3)',margin:'6px 0 12px',lineHeight:1.5}}>Notificação quando o preço cair</p>
                <input className="alert-input" type="email" placeholder="seu@email.com" />
                <button className="alert-btn">Cadastrar alerta</button>
              </div>
            </div>
            {/* Products */}
            <div>
              <div className="results-bar">
                <span style={{fontSize:14,color:'var(--text2)'}}><strong style={{color:'var(--text)'}}>2.847</strong> resultados</span>
                <select className="sort-select">
                  <option>Maior Score IA</option><option>Maior desconto</option>
                  <option>Menor preço</option><option>Mais avaliados</option>
                </select>
              </div>
              <div className="pgrid g4">
                {PRODUCTS.map(p => (
                  <div key={p.id} className="pcard fadein" onClick={() => nav('product')}>
                    <div className="pcard-img">
                      <div className="pcard-badges"><span className="pbdg pb-disc">{p.disc}</span></div>
                      <button className={`wish-btn${favorites.has(p.id)?' on':''}`} onClick={(e) => toggleFav(p.id,e)}>{favorites.has(p.id)?'♥':'♡'}</button>
                      <img src={p.img} alt={p.title} onError={(e:any) => e.target.style.opacity='0'} />
                    </div>
                    <div className="pcard-body">
                      <div className="pcard-brand">{p.brand}</div>
                      <div className="pcard-title">{p.title}</div>
                      <div className="pcard-stars"><div className="stars">{Array(5).fill(0).map((_,i) => <span key={i} className={i<p.stars?'star-on':'star-off'}>★</span>)}</div><span className="star-count">{p.reviews}</span></div>
                      <div className="pcard-pricing"><div className="price-line"><span className="price-now">{p.price}</span><span className="price-old">{p.old}</span></div></div>
                      <div className="score-mini"><div className="score-mini-track"><div className="score-mini-fill" style={{width:`${p.score}%`}}></div></div><span className="score-mini-lbl">{p.score}/100</span></div>
                      <button className="card-cta">🛒 Ver na Amazon</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ADMIN PAGE ══════════ */}
      {page === 'admin' && user?.role === 'admin' && (
        <div style={{background:'var(--bg)',minHeight:'100vh'}}>
          <div className="admin-wrap">
            <div className="admin-sidebar">
              <div className="admin-sidebar-head">
                <h3>⚔️ Painel Admin</h3>
                <p>OfertaMax — Controle total</p>
              </div>
              <nav className="admin-nav">
                <div className="admin-section">Principal</div>
                {[
                  {id:'dashboard',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,label:'Dashboard'},
                  {id:'products',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>,label:'Produtos',badge:'12.847'},
                  {id:'users',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,label:'Usuários & Admins'},
                ].map(item => (
                  <button key={item.id} className={`admin-link${adminTab===item.id?' active':''}`} onClick={() => setAdminTab(item.id as any)}>
                    {item.icon}{item.label}
                    {item.badge && <span className="al-badge">{item.badge}</span>}
                  </button>
                ))}
                <div className="admin-section">Sistema</div>
                <button className="admin-link" onClick={() => nav('home')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  Ver site
                </button>
              </nav>
            </div>
            <div className="admin-main">

              {adminTab === 'dashboard' && (
                <>
                  <div className="admin-topbar">
                    <div><h1>Dashboard</h1><p>Atualizado há 8 min</p></div>
                    <div className="admin-btns">
                      <button className="adm-btn">📥 Importar</button>
                      <button className="adm-btn">🤖 Scores IA</button>
                      <button className="adm-btn primary">+ Novo Produto</button>
                    </div>
                  </div>
                  <div className="kpi-grid">
                    {[{ico:'📦',val:'12.847',name:'Ofertas ativas',trend:'↑ +247'},{ico:'👆',val:'8.241',name:'Cliques hoje',trend:'↑ +18%'},{ico:'💰',val:'R$ 2.413',name:'Receita estimada',trend:'↑ +12%'},{ico:'👥',val:'14.832',name:'Usuários',trend:'↑ +127'},{ico:'🤖',val:'384',name:'Score 80+ (Top)',trend:'↑ +29'},{ico:'📱',val:'1.284',name:'Posts nos bots',trend:'↓ 3 plats.'},].map(k => (
                      <div key={k.name} className="kpi"><div className="kpi-ico">{k.ico}</div><div className="kpi-val">{k.val}</div><div className="kpi-name">{k.name}</div><div className={`kpi-trend${k.trend.startsWith('↓')?' down':''}`}>{k.trend}</div></div>
                    ))}
                  </div>
                  <div className="admin-cols">
                    <div className="admin-panel">
                      <div className="ap-head">📊 Cliques — 7 dias</div>
                      <div className="ap-body">
                        <div className="bar-chart">
                          {[{d:'Seg',v:4200},{d:'Ter',v:6100},{d:'Qua',v:5400},{d:'Qui',v:7800},{d:'Sex',v:8241},{d:'Sáb',v:5600},{d:'Dom',v:6900}].map(b => (
                            <div key={b.d} className="bc"><div className="bc-val">{(b.v/1000).toFixed(1)}k</div><div className="bc-bar" style={{height:`${(b.v/8241)*100}%`}}></div><div className="bc-lbl">{b.d}</div></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="admin-panel">
                      <div className="ap-head">⚡ Ações rápidas</div>
                      {[['📥','Importar por ASIN'],['📂','Gerenciar categorias'],['🤖','Atualizar scores IA'],['🗺️','Regenerar sitemap'],['📧','Enviar newsletter'],['👥','Gerenciar admins']].map(([ico,lbl]) => (
                        <div key={lbl} className="ql-item" onClick={() => lbl==='Gerenciar admins' && setAdminTab('users')}><span className="ql-ico">{ico}</span>{lbl}<span className="ql-arr">→</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="admin-panel">
                    <div className="ap-head">🏆 Top produtos esta semana</div>
                    <div style={{overflowX:'auto'}}>
                      <table className="data-tbl">
                        <thead><tr><th>#</th><th>Produto</th><th>Preço</th><th>Desc.</th><th>Score</th><th>Cliques</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          {PRODUCTS.map((p,i) => (
                            <tr key={p.id}>
                              <td style={{color:'var(--text3)',fontWeight:600}}>{i+1}</td>
                              <td><div className="dt-name" onClick={() => nav('product')}>{p.brand} — {p.title.slice(0,40)}...</div><div className="dt-asin">{p.asin}</div></td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:'var(--orange)'}}>{p.price}</td>
                              <td><span className="pbdg pb-disc">{p.disc}</span></td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:'var(--orange)'}}>{p.score}</td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{(3482-i*400).toLocaleString()}</td>
                              <td><div className={i===4?'st-warn':'st-on'}><span className="st-dot"></span>{i===4?'Expirando':'Ativo'}</div></td>
                              <td><button className="tbl-act">Editar</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {adminTab === 'users' && (
                <>
                  <div className="admin-topbar"><div><h1>Usuários & Admins</h1><p>Gerencie contas e permissões de administrador</p></div></div>
                  <div className="add-admin-box">
                    <h3>⚔️ Adicionar novo Admin</h3>
                    <p style={{fontSize:13,color:'var(--text3)',marginBottom:12}}>Somente administradores podem criar outras contas com acesso admin.</p>
                    <div className="add-admin-row">
                      <input className="aa-input" placeholder="Nome completo" value={newAdminName} onChange={e=>setNewAdminName(e.target.value)} />
                      <input className="aa-input" type="email" placeholder="Email do novo admin" value={newAdminEmail} onChange={e=>setNewAdminEmail(e.target.value)} />
                      <input className="aa-input" type="password" placeholder="Senha temporária" value={newAdminPass} onChange={e=>setNewAdminPass(e.target.value)} />
                      <button className="aa-btn" onClick={addAdmin}>+ Criar Admin</button>
                    </div>
                    {adminMsg && <div style={{fontSize:12,marginTop:8,color:adminMsg.startsWith('err:')?'var(--red)':'var(--green)'}}>{adminMsg.replace(/^(ok:|err:)/,'')}</div>}
                  </div>
                  <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>Administradores ativos</h3>
                  {adminUsers.map((u,i) => (
                    <div key={u.email} className="user-card">
                      <div className="uc-avatar" style={{background:i===0?'var(--orange)':'var(--blue)',color:i===0?'#000':'white'}}>{u.name[0]}</div>
                      <div className="uc-info"><div className="uc-name">{u.name}</div><div className="uc-email">{u.email}</div></div>
                      <span className="uc-role admin">⚔️ Admin</span>
                      <div className="uc-actions">
                        {i===0 ? <button className="uc-btn" style={{color:'var(--text3)',cursor:'default'}}>Você</button>
                          : <button className="uc-btn danger" onClick={() => setAdminUsers(prev => prev.filter((_,j)=>j!==i))}>Remover</button>}
                      </div>
                    </div>
                  ))}
                  <h3 style={{fontSize:15,fontWeight:700,margin:'20px 0 12px'}}>Todos os usuários</h3>
                  {regularUsers.filter(u => !promotedUsers.includes(u.email)).map(u => (
                    <div key={u.email} className="user-card">
                      <div className="uc-avatar" style={{background:'var(--blue)',color:'white'}}>{u.name[0]}</div>
                      <div className="uc-info"><div className="uc-name">{u.name}</div><div className="uc-email">{u.email}</div></div>
                      <span className="uc-role user">Usuário</span>
                      <div className="uc-actions">
                        <button className="uc-btn" onClick={() => { promoteUser(u.email); setPromotedUsers(p => [...p, u.email]) }}>Tornar Admin</button>
                        <button className="uc-btn danger">Suspender</button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {adminTab === 'products' && (
                <>
                  <div className="admin-topbar">
                    <div><h1>Produtos</h1><p>12.847 no banco de dados</p></div>
                    <div className="admin-btns"><button className="adm-btn">🔍 Buscar ASIN</button><button className="adm-btn primary">+ Adicionar</button></div>
                  </div>
                  <div className="admin-panel">
                    <div style={{overflowX:'auto'}}>
                      <table className="data-tbl">
                        <thead><tr><th>Produto</th><th>ASIN</th><th>Preço</th><th>Desc.</th><th>Score</th><th>Status</th><th>Ações</th></tr></thead>
                        <tbody>{PRODUCTS.map((p,i) => (
                          <tr key={p.id}>
                            <td><div className="dt-name" onClick={() => nav('product')}>{p.brand} — {p.title.slice(0,35)}...</div></td>
                            <td className="dt-asin">{p.asin}</td>
                            <td style={{fontFamily:"'JetBrains Mono',monospace"}}>{p.price}</td>
                            <td><span className="pbdg pb-disc">{p.disc}</span></td>
                            <td style={{color:'var(--orange)',fontWeight:700}}>{p.score}</td>
                            <td><div className={i===4?'st-warn':'st-on'}><span className="st-dot"></span>{i===4?'Expirando':'Ativo'}</div></td>
                            <td><button className="tbl-act">Editar</button> · <button className="tbl-act" style={{color:'var(--red)'}}>Remover</button></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Redirect if not admin */}
      {page === 'admin' && user?.role !== 'admin' && (
        <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
          <div style={{fontSize:48}}>🔒</div>
          <h2 style={{fontSize:20,fontWeight:800}}>Acesso restrito</h2>
          <p style={{color:'var(--text3)'}}>Você precisa de uma conta admin para acessar esta área.</p>
          <button className="hero-btn primary" onClick={() => { setModalOpen(true); setModalTab('login') }}>Fazer login como admin</button>
        </div>
      )}

      {/* ── LOGIN MODAL ── */}
      <div className={`modal-overlay${modalOpen?' open':''}`} onClick={() => setModalOpen(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <h2>{modalTab==='login'?'Entrar na conta':'Criar conta grátis'}</h2>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          </div>
          <div className="modal-body">
            <div className="modal-tabs">
              <button className={`modal-tab${modalTab==='login'?' active':''}`} onClick={() => setModalTab('login')}>Entrar</button>
              <button className={`modal-tab${modalTab==='register'?' active':''}`} onClick={() => setModalTab('register')}>Criar conta</button>
            </div>
            {modalTab === 'login' ? (
              <>
                <div className="field"><label>Email</label><input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="seu@email.com" /></div>
                <div className="field"><label>Senha</label><input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="Sua senha" onKeyDown={e=>e.key==='Enter'&&doLogin()} /></div>
                <button className="form-btn" onClick={doLogin}>Entrar</button>
                <p className="modal-footer-text">Admin demo: <strong>admin@ofertamax.com</strong> / qualquer senha</p>
              </>
            ) : (
              <>
                <div className="field"><label>Nome</label><input type="text" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Seu nome" /></div>
                <div className="field"><label>Email</label><input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="seu@email.com" /></div>
                <div className="field"><label>Senha</label><input type="password" value={regPass} onChange={e=>setRegPass(e.target.value)} placeholder="Mínimo 8 caracteres" /></div>
                <button className="form-btn" onClick={doRegister}>Criar conta grátis</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE NAV ── */}
      <nav className="mob-nav">
        <button className={`mob-link${page==='home'?' active':''}`} onClick={() => nav('home')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Início
        </button>
        <button className={`mob-link${page==='category'?' active':''}`} onClick={() => nav('category')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          Categorias
        </button>
        <button className="mob-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Buscar
        </button>
        <button className="mob-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          Favoritos
        </button>
        <button className="mob-link" onClick={() => user ? setProfileOpen(o=>!o) : setModalOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Conta
        </button>
      </nav>
    </>
  )
}
