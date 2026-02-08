import React, { useState, useEffect } from 'react';
import { ScreenName, Asset } from './types';
import { MOCK_ASSETS, NETWORKS } from './constants';

// Icons
import { 
  Home, 
  Wallet, 
  BarChart2, 
  Settings, 
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  User,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Search,
  CheckCircle,
  X
} from 'lucide-react';

// Components
import { Button, Input, Header, NumPad } from './components/Shared';
import { LineChartMini } from './components/Charts';

// --- Screens ---

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-main relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1c35] via-bg-main to-bg-main pointer-events-none opacity-40"></div>
      
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Inner Orbit */}
        <div className="absolute w-32 h-32 rounded-full border border-white/10 animate-spin-slow">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(127,102,255,0.8)]"></div>
        </div>
        {/* Outer Orbit */}
        <div className="absolute w-64 h-64 rounded-full border border-white/5 animate-reverse-spin">
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-success rounded-full shadow-[0_0_12px_rgba(4,159,108,0.8)]"></div>
        </div>
        {/* Center Point */}
        <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
      </div>

      <div className="mt-8 text-center z-10">
        <h1 className="text-5xl font-bold tracking-widest mb-4 font-sans text-white">ZVE</h1>
        <p className="text-[10px] font-bold tracking-[0.4em] text-white/70 uppercase animate-pulse-fast">
          Estableciendo conexión
        </p>
      </div>

      <div className="absolute bottom-12 w-full px-12 flex justify-between text-[10px] text-white/30 font-mono tracking-widest uppercase">
        <span>SYS.OK</span>
        <span>ENC: AES-256</span>
        <span>LAT: 40ms</span>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ onLogin, onRegister }: { onLogin: () => void, onRegister: () => void }) => (
  <div className="h-full w-full flex flex-col p-6 bg-bg-main relative">
    <div className="flex-1 flex flex-col items-center justify-center mt-20">
      <h1 className="text-4xl font-bold mb-8">ZVE</h1>
      <div className="w-40 h-40 bg-gradient-to-br from-bg-card to-bg-lighter rounded-full flex items-center justify-center mb-12 shadow-[0_0_40px_rgba(127,102,255,0.15)] border border-white/5">
        <Shield size={64} className="text-primary" />
      </div>
      <h2 className="text-3xl font-bold text-center mb-4 leading-tight">
        Empieza tu viaje<br />Crypto hoy
      </h2>
      <p className="text-gray-400 text-center text-sm px-4">
        Regístrate en minutos y desbloquea un mundo de finanzas digitales seguras, simples y transparentes.
      </p>
    </div>
    <div className="space-y-4 mb-8 w-full animate-slide-up">
      <Button onClick={onRegister}>Continuar con Email</Button>
      <Button variant="outline" className="border-bg-lighter text-white hover:bg-bg-card">
         Google
      </Button>
      <Button variant="ghost" onClick={onLogin}>Iniciar sesión con contraseña</Button>
    </div>
    <p className="text-[10px] text-gray-500 text-center px-4">
      Al tocar Continuar, aceptas nuestros Términos y Política de Privacidad.
    </p>
  </div>
);

const LoginScreen = ({ onBack, onLogin }: { onBack: () => void, onLogin: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="h-full w-full bg-bg-main p-6 flex flex-col">
      <Header onBack={onBack} />
      <div className="flex-1 mt-8">
        <h1 className="text-3xl font-bold text-center mb-12">Iniciar sesión</h1>
        <div className="space-y-4">
          <Input placeholder="Correo electrónico" type="email" />
          <Input 
            placeholder="Contraseña" 
            type={showPass ? "text" : "password"}
            rightIcon={
              <button onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          <div className="text-right">
            <button className="text-sm text-gray-400 hover:text-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6 space-y-4">
        <Button onClick={onLogin}>Entrar</Button>
        <div className="text-center text-sm text-gray-400">
          ¿No tienes una cuenta? <button className="text-primary font-semibold">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

const RegisterScreen = ({ onBack, onRegister }: { onBack: () => void, onRegister: () => void }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="h-full w-full bg-bg-main p-6 flex flex-col">
      <Header onBack={onBack} />
      <div className="flex-1 mt-4">
        <h1 className="text-3xl font-bold text-center mb-8">Crear cuenta</h1>
        <div className="space-y-4">
          <Input placeholder="Nombre completo" type="text" />
          <Input placeholder="Correo electrónico" type="email" />
          <Input 
            placeholder="Contraseña" 
            type={showPass ? "text" : "password"}
            rightIcon={
              <button onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
          <Input placeholder="Confirmar contraseña" type={showPass ? "text" : "password"} />
          
          <div className="flex items-start gap-3 mt-6 px-1">
             <div className="w-5 h-5 rounded border border-primary/50 flex items-center justify-center mt-0.5 shrink-0">
               <div className="w-3 h-3 bg-primary rounded-sm"></div>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">
               Al registrarme, acepto los <span className="text-primary font-semibold">Términos de Servicio</span> y la <span className="text-primary font-semibold">Política de Privacidad</span> de ZVE Crypto.
             </p>
          </div>
        </div>
      </div>
      <div className="mb-6 space-y-4">
        <Button onClick={onRegister}>Crear Cuenta</Button>
        <div className="text-center text-sm text-gray-400">
          ¿Ya tienes cuenta? <button onClick={onBack} className="text-primary font-semibold">Inicia sesión</button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ onNavigate, onAssetSelect }: { onNavigate: (screen: ScreenName) => void, onAssetSelect: (id: string) => void }) => (
  <div className="h-full w-full bg-bg-main flex flex-col pb-24 overflow-y-auto no-scrollbar">
    <div className="px-6 pt-12 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
          <div className="flex items-end gap-2">
            <h1 className="text-4xl font-bold">$12,450.00</h1>
            <span className="text-success font-medium mb-1.5 text-sm">+5.2%</span>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-bg-card transition-colors" onClick={() => onNavigate('ACTIVITY')}>
           <Bell size={24} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-bg-main"></span>
        </button>
      </div>

      <div className="h-48 w-full mb-8">
        <LineChartMini data={MOCK_ASSETS[0].history} height={180} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <ArrowDownLeft size={24} />, label: 'Deposit', action: () => {} },
          { icon: <ArrowUpRight size={24} />, label: 'Withdraw', action: () => onNavigate('SEND_AMOUNT') },
          { icon: <RefreshCw size={24} />, label: 'Exchange', action: () => onNavigate('MARKETS') },
        ].map((item, i) => (
          <button key={i} onClick={item.action} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full bg-bg-card border border-white/5 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(127,102,255,0.15)] group-hover:scale-105 transition-transform group-active:scale-95">
              {item.icon}
            </div>
            <span className="text-xs text-gray-300 font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-4">Your Assets</h3>
      <div className="space-y-3">
        {MOCK_ASSETS.map((asset) => (
          <div 
            key={asset.id} 
            onClick={() => { onAssetSelect(asset.id); onNavigate('ASSET_DETAIL'); }} 
            className="bg-bg-card rounded-2xl p-4 flex items-center justify-between border border-white/5 active:bg-bg-lighter transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: asset.color }}>
                 {asset.symbol[0]}
              </div>
              <div>
                <p className="font-bold text-white">{asset.name}</p>
                <p className="text-xs text-gray-400">{asset.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">${asset.balanceUsd.toLocaleString()}</p>
              <p className="text-xs text-success">+{asset.change24h}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AssetDetailScreen = ({ onBack, assetId }: { onBack: () => void, assetId: string }) => {
  const asset = MOCK_ASSETS.find(a => a.id === assetId) || MOCK_ASSETS[0];

  return (
    <div className="h-full w-full bg-bg-main flex flex-col">
      <Header 
        onBack={onBack} 
        title={asset.name} 
        rightElement={
          <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
             <span className="font-bold text-xs text-white">{asset.symbol}</span>
          </div>
        } 
      />
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">${asset.price.toLocaleString()}</h2>
          <span className={`font-medium px-3 py-1 rounded-full text-sm ${asset.change24h >= 0 ? 'text-success bg-success/10' : 'text-danger bg-danger/10'}`}>
            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}% (24h)
          </span>
        </div>

        <div className="flex justify-between px-4 mb-6">
          {['1D', '1S', '1M', 'YTD', 'TODO'].map((p, i) => (
            <button key={p} className={`text-xs font-bold px-3 py-1 rounded-full ${i === 1 ? 'bg-bg-card text-white' : 'text-gray-500'}`}>
              {p}
            </button>
          ))}
        </div>

        <div className="h-64 mb-8">
          <LineChartMini data={asset.history} color={asset.color} height={250} />
        </div>

        <div className="bg-bg-card rounded-3xl p-6 border border-white/5 mb-8">
          <h3 className="text-gray-300 font-medium mb-6">Estadísticas clave</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-400">
                <BarChart2 size={20} />
                <span className="text-sm">Cap. de mercado</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">$250.5B</p>
                <p className="text-xs text-gray-500">8.38% dominio</p>
              </div>
            </div>
            <div className="w-full h-px bg-white/5"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-gray-400">
                <RefreshCw size={20} />
                <span className="text-sm">Volumen 24H</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">$11.8B</p>
                <p className={`text-xs ${asset.change24h >= 0 ? 'text-success' : 'text-danger'}`}>
                   {asset.change24h >= 0 ? '↗' : '↘'} 0.02%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-bg-main border-t border-white/5 flex gap-4">
        <Button variant="secondary" className="flex-1 bg-bg-card hover:bg-bg-lighter">Vender</Button>
        <Button className="flex-1">Comprar</Button>
      </div>
    </div>
  );
};

const SendAmountScreen = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
  const [amount, setAmount] = useState('0');

  const handleNum = (n: string) => {
    if (amount === '0' && n !== '.') setAmount(n);
    else setAmount(prev => prev + n);
  };
  const handleDelete = () => setAmount(prev => prev.slice(0, -1) || '0');

  return (
    <div className="h-full w-full bg-bg-main flex flex-col">
      <Header onBack={onBack} title="Enviar" />
      
      <div className="flex-1 flex flex-col items-center px-6 pt-8">
        <div className="w-full flex justify-between items-center mb-12">
           <h1 className="text-5xl font-bold transition-all duration-200">${amount}</h1>
           <div className="flex flex-col items-end">
             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
             </div>
             <span className="text-[10px] text-gray-400 mt-1">USD / BTC</span>
           </div>
        </div>

        <div className="w-full mb-8">
           <p className="text-gray-400 text-sm mb-2 pl-1">Activo a enviar</p>
           <div className="bg-bg-card p-4 rounded-2xl flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold">₿</div>
                 <div>
                    <p className="font-bold">Bitcoin</p>
                    <p className="text-xs text-gray-400">Saldo disponible: $61,000.00</p>
                 </div>
              </div>
              <ChevronRight className="text-gray-500" />
           </div>
        </div>

        <div className="mt-auto w-full">
           <NumPad onNumber={handleNum} onDelete={handleDelete} onDecimal={() => setAmount(prev => prev.includes('.') ? prev : prev + '.')} />
           <div className="px-6 pb-6">
             <Button onClick={onNext} className={Number(amount) === 0 ? 'opacity-50 pointer-events-none' : ''}>Siguiente</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const SendMethodScreen = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
  return (
    <div className="h-full w-full bg-bg-main flex flex-col">
      <Header onBack={onBack} />
      <div className="px-6 pt-2">
         <h1 className="text-3xl font-bold mb-8">Método de envío</h1>
         <div className="space-y-4">
            <button className="w-full bg-bg-card hover:bg-bg-lighter border border-primary/50 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(127,102,255,0.15)]">
               <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <User size={24} />
               </div>
               <h3 className="text-lg font-bold">A otro usuario ZVE</h3>
               <p className="text-sm text-gray-400 text-center px-4">Envío instantáneo y sin comisiones mediante nombre de usuario o email</p>
            </button>

            <button onClick={onNext} className="w-full bg-bg-card hover:bg-bg-lighter border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                  <ArrowUpRight size={24} />
               </div>
               <h3 className="text-lg font-bold">Enviar por la cadena</h3>
               <p className="text-sm text-gray-400 text-center px-4">Envío a carteras externas (MetaMask, Ledger, etc.)</p>
            </button>
         </div>
      </div>
    </div>
  );
};

const SendNetworkScreen = ({ onBack, onNext }: { onBack: () => void, onNext: () => void }) => {
  const [selected, setSelected] = useState(NETWORKS[1].id); // Default ERC20

  return (
    <div className="h-full w-full bg-bg-main flex flex-col">
      <Header onBack={onBack} title="Elegir Red" />
      <div className="px-6 pt-6 flex-1 overflow-y-auto no-scrollbar">
        <p className="text-sm text-gray-400 mb-6">Asegúrate de que la red seleccionada coincida con la dirección de retiro.</p>
        <div className="space-y-3">
          {NETWORKS.map(net => (
            <button 
              key={net.id}
              onClick={() => setSelected(net.id)}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selected === net.id ? 'bg-primary/10 border-primary' : 'bg-bg-card border-white/5 hover:border-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-bg-lighter flex items-center justify-center font-bold text-xs">
                  {net.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">{net.name}</p>
                  <p className="text-xs text-gray-400">Comisión: <span className="text-gray-300">{net.fee}</span></p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected === net.id ? 'bg-primary border-primary' : 'border-gray-600'}`}>
                 {selected === net.id && <CheckCircle size={12} className="text-white"/>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <Button onClick={onNext}>Confirmar</Button>
      </div>
    </div>
  );
};

const SecurityCheck = ({ onComplete }: { onComplete: () => void }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  
  const handleInput = (val: string, idx: number) => {
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if(val && idx < 5) {
      document.getElementById(`otp-${idx+1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 animate-slide-up border-t sm:border border-white/10">
         <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-8"></div>
         <h2 className="text-2xl font-bold text-center mb-2">Verificación de Seguridad</h2>
         <p className="text-gray-400 text-center text-sm mb-8">Introduce el código de 6 dígitos de tu aplicación de autenticación para continuar</p>
         
         <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, i) => (
              <input 
                key={i}
                id={`otp-${i}`}
                type="text" 
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(e.target.value, i)}
                className="w-12 h-14 bg-bg-main border border-primary/30 rounded-xl text-center text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            ))}
         </div>

         <Button onClick={onComplete} className="mb-4">Enviar</Button>
         
         <div className="text-center space-y-2">
           <button className="text-primary text-sm">¿No puedes acceder a tu app?</button>
           <br/>
           <button className="text-primary text-sm">Contactar con Soporte</button>
         </div>
      </div>
    </div>
  );
};

const ProfileScreen = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="h-full w-full bg-bg-main flex flex-col">
       <Header title="Perfil" onBack={() => {}} />
       <div className="px-6 pt-4 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-20 h-20 rounded-full bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-primary to-primary-dark">AG</div>
                <div className="absolute bottom-0 right-0 p-1 bg-bg-card rounded-full">
                   <div className="bg-gray-600 p-1 rounded-full"><User size={12} /></div>
                </div>
             </div>
             <div>
                <h2 className="text-xl font-bold">Alex Goldberg</h2>
                <p className="text-gray-400 text-sm">alexgoldberg@gmail.com</p>
             </div>
          </div>

          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl p-6 mb-8 border border-primary/30 relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">ZVE Pro</h3>
                    <p className="text-xs text-gray-300 max-w-[200px]">Desbloquea ZVE Pro. Disfruta de gráficos avanzados y tarifas de trading más bajas.</p>
                  </div>
                  <div className="text-primary text-4xl">💎</div>
                </div>
                <Button className="h-10 text-sm bg-primary/20 hover:bg-primary/30 border border-primary/50 shadow-none">Mejorar a Pro</Button>
             </div>
          </div>

          <div className="bg-bg-card rounded-3xl border border-white/5 overflow-hidden">
             {[
               { icon: <User size={20} />, label: 'Configuración de cuenta' },
               { icon: <Bell size={20} />, label: 'Preferencias de notificación' },
               { icon: <CreditCard size={20} />, label: 'Métodos de pago' },
               { icon: <Shield size={20} />, label: 'Seguridad' },
               { icon: <Settings size={20} />, label: 'Preferencias' },
             ].map((item, i) => (
               <button key={i} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                     <span className="text-gray-400">{item.icon}</span>
                     <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
               </button>
             ))}
             <button onClick={onLogout} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-danger">
                  <div className="flex items-center gap-4">
                     <LogOut size={20} />
                     <span>Cerrar sesión</span>
                  </div>
                  <ChevronRight size={16} className="text-danger/50" />
             </button>
          </div>
          <div className="h-24"></div>
       </div>
    </div>
  );
};

// Bottom Navigation
const BottomNav = ({ active, onChange }: { active: ScreenName, onChange: (s: ScreenName) => void }) => {
  const tabs = [
    { id: 'HOME', icon: Home, label: 'Inicio' },
    { id: 'WALLET', icon: React.forwardRef((props, ref) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>), label: 'Cartera' },
    { id: 'TRADE_FAB', icon: null, label: '' }, // FAB placeholder
    { id: 'MARKETS', icon: BarChart2, label: 'Mercados' },
    { id: 'PROFILE', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-bg-card border-t border-white/5 pb-8 pt-4 px-6 z-40">
      <ul className="flex justify-between items-center">
        {tabs.map((tab) => {
          if (tab.id === 'TRADE_FAB') {
            return (
              <li key={tab.id} className="relative -top-6">
                <button className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-[0_0_20px_rgba(127,102,255,0.4)] text-white hover:scale-105 active:scale-95 transition-transform">
                  <RefreshCw size={24} />
                </button>
              </li>
            );
          }
          const isActive = active === tab.id || (active === 'ACTIVITY' && tab.id === 'HOME'); // Activity is sub-screen of home
          const Icon = tab.icon as any;
          return (
            <li key={tab.id}>
              <button 
                onClick={() => onChange(tab.id as ScreenName)}
                className={`flex flex-col items-center gap-1 group ${isActive ? 'text-primary' : 'text-gray-500'}`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : 'group-hover:bg-white/5'}`}>
                   <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// --- Main App Component ---

const App = () => {
  const [screen, setScreen] = useState<ScreenName>('SPLASH');
  const [showSecurity, setShowSecurity] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');

  const navigate = (s: ScreenName) => setScreen(s);

  // Simple router
  const renderScreen = () => {
    switch(screen) {
      case 'SPLASH': return <SplashScreen onFinish={() => setScreen('WELCOME')} />;
      case 'WELCOME': return <WelcomeScreen onLogin={() => setScreen('LOGIN')} onRegister={() => setScreen('REGISTER')} />;
      case 'LOGIN': return <LoginScreen onBack={() => setScreen('WELCOME')} onLogin={() => setScreen('HOME')} />;
      case 'REGISTER': return <RegisterScreen onBack={() => setScreen('WELCOME')} onRegister={() => setScreen('HOME')} />;
      case 'HOME': return <HomeScreen onNavigate={navigate} onAssetSelect={setSelectedAssetId} />;
      case 'ASSET_DETAIL': return <AssetDetailScreen onBack={() => setScreen('HOME')} assetId={selectedAssetId} />;
      case 'SEND_AMOUNT': return <SendAmountScreen onBack={() => setScreen('HOME')} onNext={() => setScreen('SEND_METHOD')} />;
      case 'SEND_METHOD': return <SendMethodScreen onBack={() => setScreen('SEND_AMOUNT')} onNext={() => setScreen('SEND_NETWORK')} />;
      case 'SEND_NETWORK': return <SendNetworkScreen onBack={() => setScreen('SEND_METHOD')} onNext={() => setShowSecurity(true)} />;
      case 'PROFILE': return <ProfileScreen onLogout={() => setScreen('WELCOME')} />;
      case 'ACTIVITY': 
        return (
          <div className="h-full w-full bg-bg-main">
            <Header onBack={() => setScreen('HOME')} title="Ganancias y Trading" />
            <div className="px-6 pt-4">
               <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm">Ganancia Total de Hoy</p>
                  <h2 className="text-5xl font-bold mt-2">+$450.20</h2>
                  <div className="inline-block mt-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm font-bold">+3.45%</div>
               </div>
               <div className="h-64 w-full mb-8">
                  <LineChartMini data={MOCK_ASSETS[0].history} color="#8B5CF6" height={250} />
               </div>
               <h3 className="text-xl font-bold mb-4">Actividad</h3>
               <div className="space-y-4">
                  <div className="bg-bg-card p-4 rounded-2xl flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500">₿</div>
                       <div><p className="font-bold">Compra BTC</p><p className="text-xs text-gray-500">14:30 PM</p></div>
                    </div>
                    <div className="text-right"><p className="font-bold">$12,450.00</p><p className="text-xs text-success">+0.045 BTC</p></div>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'MARKETS': return (
        <div className="h-full w-full bg-bg-main p-6 pb-24">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full bg-bg-card h-12 rounded-xl pl-12 pr-4 text-white outline-none focus:ring-1 ring-primary" placeholder="Buscar" />
           </div>
           <h2 className="text-xl font-bold mb-4">Activos Populares</h2>
           <div className="space-y-2">
             {MOCK_ASSETS.map(a => (
               <div 
                 key={a.id} 
                 className="flex items-center justify-between p-3 hover:bg-bg-card rounded-xl transition-colors cursor-pointer" 
                 onClick={() => { setSelectedAssetId(a.id); setScreen('ASSET_DETAIL'); }}
               >
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background: a.color}}>{a.symbol[0]}</div>
                     <div><p className="font-bold">{a.name}</p><p className="text-xs text-gray-400">{a.symbol}</p></div>
                  </div>
                  <div className="w-24 h-10"><LineChartMini data={a.history} color={a.change24h > 0 ? '#10B981' : '#EF4444'} height={40} showXAxis={false} /></div>
                  <div className="text-right"><p className="font-bold">${a.price.toLocaleString()}</p><p className={`text-xs ${a.change24h > 0 ? 'text-success' : 'text-danger'}`}>{a.change24h}%</p></div>
               </div>
             ))}
           </div>
        </div>
      );
      default: return <HomeScreen onNavigate={navigate} onAssetSelect={setSelectedAssetId} />;
    }
  };

  const showNav = ['HOME', 'PROFILE', 'MARKETS', 'ACTIVITY'].includes(screen);

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-bg-main text-white font-sans relative overflow-hidden shadow-2xl sm:rounded-[3rem] sm:my-8 sm:h-[90vh] sm:border-[8px] sm:border-gray-900">
      {renderScreen()}
      {showNav && <BottomNav active={screen} onChange={navigate} />}
      {showSecurity && (
        <SecurityCheck onComplete={() => { setShowSecurity(false); setScreen('HOME'); }} />
      )}
    </div>
  );
};

export default App;