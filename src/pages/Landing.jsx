import React, { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Smartphone, Globe, CheckCircle2, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- 1. IMPORTS ---
import logoImg from "/Dark.png";
import macFrImg from "/images/Dash-fr.png";
import macArImg from "/images/Dash-ar.png";
import phoneImg from "/images/phone.png";
import tapeImg from "/landing.png";
import apkFile from "/mosagro.apk";

// --- 2. UI COMPONENTS ---

const GlassButton = ({ children, primary, className, ...props }) => (
  <button
    className={`
      relative overflow-hidden group px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300
      ${primary
        ? "bg-[#4FABF3] text-white shadow-[0px_4px_0px_#2B7ABF] hover:shadow-[0px_6px_0px_#2B7ABF] hover:-translate-y-0.5 active:shadow-none active:translate-y-[4px]"
        : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md"
      }
      ${className}
    `}
    {...props}
  >
    <div className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </div>
  </button>
);

export default function Landing() {
  const [lang, setLang] = useState("fr");
  const navigate = useNavigate();

  // --- Download APK Handler ---
  const handleDownloadAPK = () => {
    const link = document.createElement("a");
    link.href = apkFile;
    link.download = "mosagro.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Parallax Logic ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 20);
      mouseY.set((clientY / innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Content Dictionary
  const t = {
    fr: {
      nav: { login: "Connexion", signup: "Devenir Partenaire" },
      badge: "ECOSYSTEME B2B #1 EN ALGÉRIE",
      title: "Gérez tout votre stock,",
      highlight: "depuis votre poche.",
      desc: "La plateforme qui connecte grossistes et détaillants en temps réel. Commandez, suivez et optimisez.",
      stats: [
        { val: "+15k", label: "Produits" },
        { val: "24h", label: "Livraison" },
        { val: "100%", label: "Sécurisé" },
      ],
      cta: { main: "Télécharger l'App", sec: "Accès Grossiste" },
    },
    ar: {
      nav: { login: "دخول", signup: "تسجيل" },
      badge: "النظام البيئي B2B الأول في الجزائر",
      title: "سيّر سلعتك و تجارتك،",
      highlight: "غير مالتليفون.",
      desc: "المنصة الجزائرية الأولى للربط بين تجار الجملة والتجزئة. سهل طلبياتك، تبع سلعتك ونظم دراهمك.",
      stats: [
        { val: "+15k", label: "منتج" },
        { val: "24h", label: "توصيل" },
        { val: "100%", label: "آمن" },
      ],
      cta: { main: "حمل التطبيق", sec: "دخول الجملة" },
    },
  }[lang];

  const isRTL = lang === "ar";

  return (
    <div
      className="relative w-full min-h-screen bg-[#0F1528] text-white md:overflow-hidden overflow-auto selection:bg-[#4FABF3] selection:text-white"
      // --- EXACT STRUCTURE AS DASHBOARD ---
      style={{
        direction: lang === "ar" ? "rtl" : "ltr",
        fontFamily:
          lang === "ar"
            ? "Cairo-Regular, sans-serif"
            : "Montserrat, sans-serif",
      }}
    >
      {/* --- BACKGROUND LAYERS --- */}

      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* 2. Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#4A90E2]/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/15 rounded-full blur-[120px]" />

      {/* 3. THE TAPE IMAGE (Static) */}
      <div
        className={`absolute -top-24 p-0 ${isRTL ? "-left-10" : "-right-10"} ${isRTL ? "rotate-[0deg]" : "rotate-[30deg]"
          } w-[50%] lg:w-[50%] md:w-[40%] sm:w-[30%] z-0 opacity-90 pointer-events-none select-none hidden lg:block`}
      >
        <img
          src={tapeImg}
          alt="Mosagro Tape"
          className="w-full h-full object-contain"
        />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src={logoImg}
            alt="Mosagro"
            className="h-5 md:h-7 w-auto object-contain"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
              className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-md transition-colors"
              style={{
                fontFamily:
                  lang === "ar"
                    ? "Cairo-Regular, sans-serif"
                    : "Montserrat, sans-serif",
              }}
            >
              <Globe size={14} className="text-[#4FABF3]" />
              <span>{lang === "fr" ? "AR" : "FR"}</span>
            </button>
            <div className="hidden md:block">
              <GlassButton primary className="!py-2 !px-5 !text-xs">
                {t.nav.signup}
              </GlassButton>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN HERO CONTENT (100vh Centered) --- */}
      <main className="relative z-10 w-full h-full flex flex-col justify-center pt-24 md:pt-12">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 lg:px-12 gap-6 lg:gap-8 items-center">
          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 text-center lg:text-start flex flex-col items-center lg:items-start"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#4FABF3] text-[9px] md:text-[10px] font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>

              <span
                style={{
                  fontFamily:
                    lang === "ar"
                      ? "Cairo-Regular, sans-serif"
                      : "Montserrat, sans-serif",
                }}
              >
                {t.badge}
              </span>
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-3"
              style={{
                fontFamily:
                  lang === "ar"
                    ? "Cairo-Regular, sans-serif"
                    : "Montserrat, sans-serif",
              }}
            >
              {t.title}{" "}
              <span
                style={{
                  fontFamily:
                    lang === "ar"
                      ? "Cairo-Regular, sans-serif"
                      : "Montserrat, sans-serif",
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FABF3] via-sky-300 to-white"
              >
                {t.highlight}
              </span>
            </h1>

            <p
              className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg mb-6"
              style={{
                fontFamily:
                  lang === "ar"
                    ? "Cairo-Regular, sans-serif"
                    : "Montserrat, sans-serif",
              }}
            >
              {t.desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <GlassButton
                primary
                onClick={handleDownloadAPK}
                className="w-full sm:w-auto justify-center !py-2.5 !px-5"
              >
                <Smartphone size={18} />
                <span
                  style={{
                    fontFamily:
                      lang === "ar"
                        ? "Cairo-Regular, sans-serif"
                        : "Montserrat, sans-serif",
                  }}
                >
                  {t.cta.main}
                </span>
              </GlassButton>
              <GlassButton
                onClick={() => navigate("/SignIn")}
                className="w-full sm:w-auto justify-center !py-2.5 !px-5"
              >
                <Layers size={18} />
                <span
                  style={{
                    fontFamily:
                      lang === "ar"
                        ? "Cairo-Regular, sans-serif"
                        : "Montserrat, sans-serif",
                  }}
                >
                  {t.cta.sec}
                </span>
              </GlassButton>
            </div>

            {/* Small Stats */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-4 w-full max-w-md">
              {t.stats.map((stat, i) => (
                <div key={i}>
                  <h4
                    className="text-lg font-bold text-white"
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "Cairo-Regular, sans-serif"
                          : "Montserrat, sans-serif",
                    }}
                  >
                    {stat.val}
                  </h4>
                  <p
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "Cairo-Regular, sans-serif"
                          : "Montserrat, sans-serif",
                    }}
                    className="text-[9px] text-slate-500 uppercase font-bold"
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Mockups (Parallax) */}
          <div className="lg:col-span-7 relative h-[35vh] md:h-[45vh] lg:h-[55vh] w-full flex items-center justify-center">
            {/* Platform (Back) */}
            <motion.div
              style={{ x: xSpring, y: ySpring }}
              className="absolute z-10 w-[85%] md:w-[80%] max-w-2xl transform perspective-1000"
            >
              <div className="bg-[#0f131d] rounded-lg p-1 shadow-2xl border border-white/10 ring-1 ring-white/5">
                <div className="relative aspect-[16/10] bg-slate-900 rounded-md overflow-hidden border-b border-white/10">
                  <img
                    src={lang === "fr" ? macFrImg : macArImg}
                    alt="Dashboard"
                    className="w-full h-full object-fill object-top"
                  />
                </div>
              </div>
            </motion.div>

            {/* App (Front) */}
            <motion.div
              style={{
                x: useTransform(xSpring, (val) => val * -1.2),
                y: useTransform(ySpring, (val) => val * -1.2),
              }}
              className={`absolute z-20 -bottom-6 lg:-bottom-2 ${isRTL ? "left-4 lg:-left-4" : "right-4 lg:-right-4"
                } w-[28%] md:w-[23%] max-w-[190px]`}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="bg-[#121212] rounded-[1.8rem] p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] border-[3px] border-[#1f2126]">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-black rounded-full z-30"></div>
                  <div className="aspect-[9/19] bg-slate-800 rounded-[1.4rem] overflow-hidden relative">
                    <img
                      src={phoneImg}
                      alt="App"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className={`absolute top-1/4 ${isRTL ? "-right-8" : "-left-8"
                    } bg-white/10 backdrop-blur-md border border-white/20 p-1.5 px-2.5 rounded-lg shadow-xl flex items-center gap-1.5`}
                >
                  <div className="bg-green-500 p-0.5 rounded-full">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                  <p
                    className="text-[9px] font-bold text-white"
                    style={{
                      fontFamily:
                        lang === "ar"
                          ? "Cairo-Regular, sans-serif"
                          : "Montserrat, sans-serif",
                    }}
                  >
                    Livraison OK
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
