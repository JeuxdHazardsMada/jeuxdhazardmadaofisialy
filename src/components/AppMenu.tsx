import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Info,
  Settings,
  Bell,
  History as HistoryIcon,
  Star,
  Languages,
  Palette,
  Shield,
  HelpCircle,
  Phone,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Trash2,
  MessageCircle,
  Mail,
  LogOut,
  Moon,
  Sun,
  Volume2,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  readPersonalization,
  writePersonalization,
  subscribePersonalization,
  applyPalette,
  applyBackground,
  type Palette as PaletteT,
  type Personalization,
} from "@/lib/appPersonalization";

const WHATSAPP_LINK = "https://wa.me/261379594257";
const EMAIL_LINK = "mailto:jeuxdhazardmada@gmail.com";
const APP_NAME = "Jeux d'Hazard";
const APP_VERSION = "1.0.0";

type PanelKey =
  | "root"
  | "profile"
  | "about"
  | "settings"
  | "notifications"
  | "history"
  | "favorites"
  | "language"
  | "theme"
  | "privacy"
  | "help"
  | "contact";

export default function AppMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [panel, setPanel] = useState<PanelKey>("root");
  useEffect(() => { if (!open) setPanel("root"); }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[92vw] max-w-md p-0 border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <Header panel={panel} onBack={() => setPanel("root")} />
          <div className="flex-1 overflow-y-auto p-4 pb-8">
            {panel === "root" && <RootPanel goto={setPanel} onClose={() => onOpenChange(false)} />}
            {panel === "profile" && <ProfilePanel onClose={() => onOpenChange(false)} />}
            {panel === "about" && <AboutPanel />}
            {panel === "settings" && <SettingsPanel />}
            {panel === "notifications" && <NotificationsPanel />}
            {panel === "history" && <HistoryPanel onClose={() => onOpenChange(false)} />}
            {panel === "favorites" && <FavoritesPanel onClose={() => onOpenChange(false)} />}
            {panel === "language" && <LanguagePanel />}
            {panel === "theme" && <ThemePanel />}
            {panel === "privacy" && <PrivacyPanel />}
            {panel === "help" && <HelpPanel />}
            {panel === "contact" && <ContactPanel />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const PANEL_TITLES: Record<PanelKey, string> = {
  root: "Menu",
  profile: "Profil",
  about: "À propos",
  settings: "Paramètres",
  notifications: "Notifications",
  history: "Historique",
  favorites: "Favoris",
  language: "Langue",
  theme: "Thème",
  privacy: "Confidentialité",
  help: "Aide",
  contact: "Contact",
};

function Header({ panel, onBack }: { panel: PanelKey; onBack: () => void }) {
  return (
    <SheetHeader className="px-4 py-4 border-b border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-2">
        {panel !== "root" && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition -ml-1"
            aria-label="Retour"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        <SheetTitle className="text-white text-base flex items-center gap-2">
          {PANEL_TITLES[panel]}
        </SheetTitle>
      </div>
      <SheetDescription className="sr-only">{PANEL_TITLES[panel]}</SheetDescription>
    </SheetHeader>
  );
}

function Row({
  icon,
  label,
  sublabel,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  badge?: string | number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-3.5 hover:bg-white/[0.05] transition text-left active:scale-[0.99]"
    >
      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-[14px] leading-tight">{label}</p>
        {sublabel && <p className="text-[11px] text-slate-400 truncate mt-0.5">{sublabel}</p>}
      </div>
      {badge !== undefined && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 font-bold">
          {badge}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-slate-500" />
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mt-4 mb-2 px-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
        {title}
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/5 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ------------------- Root Panel ------------------- */
function RootPanel({
  goto,
  onClose,
}: {
  goto: (p: PanelKey) => void;
  onClose: () => void;
}) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);

  const displayName = profile?.full_name || profile?.name || user?.email?.split("@")[0] || "Invité";
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <div className="space-y-1">
      <button
        onClick={() => { onClose(); navigate(user ? "/profile" : "/login"); }}
        className="mb-2 w-full flex items-center gap-3 rounded-2xl p-3.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 transition"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : initial}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-[15px] truncate">{displayName}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.email || "Non connecté"}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      <Group title="Compte">
        <Row icon={<User className="w-[18px] h-[18px] text-amber-300" />} label="Profil" onClick={() => goto("profile")} />
        <Row icon={<Settings className="w-[18px] h-[18px] text-emerald-300" />} label="Paramètres" onClick={() => goto("settings")} />
        <Row icon={<Bell className="w-[18px] h-[18px] text-amber-300" />} label="Notifications" onClick={() => goto("notifications")} />
      </Group>

      <Group title="Personnalisation IA">
        <Row icon={<ImageIcon className="w-[18px] h-[18px] text-fuchsia-300" />} label="Thème & Fond IA" sublabel="Générer avec l'intelligence artificielle" onClick={() => goto("theme")} />
        <Row icon={<Palette className="w-[18px] h-[18px] text-sky-300" />} label="Palette de couleurs IA" sublabel="Générer une palette avec l'IA" onClick={() => goto("theme")} />
        <Row icon={<Languages className="w-[18px] h-[18px] text-teal-300" />} label="Langue" sublabel={p.language === "en" ? "English" : "Français"} onClick={() => goto("language")} />
      </Group>

      <Group title="Contenu">
        <Row icon={<HistoryIcon className="w-[18px] h-[18px] text-amber-300" />} label="Historique" badge={(p.history?.length ?? 0) || undefined} onClick={() => goto("history")} />
        <Row icon={<Star className="w-[18px] h-[18px] text-yellow-300" />} label="Favoris" badge={(p.favorites?.length ?? 0) || undefined} onClick={() => goto("favorites")} />
      </Group>

      <Group title="Assistance">
        <Row icon={<Info className="w-[18px] h-[18px] text-amber-300" />} label="À propos" sublabel={`Version ${APP_VERSION}`} onClick={() => goto("about")} />
        <Row icon={<HelpCircle className="w-[18px] h-[18px] text-emerald-300" />} label="Aide & FAQ" onClick={() => goto("help")} />
        <Row icon={<Phone className="w-[18px] h-[18px] text-emerald-300" />} label="Contact & Support" onClick={() => goto("contact")} />
        <Row icon={<Shield className="w-[18px] h-[18px] text-sky-300" />} label="Confidentialité" onClick={() => goto("privacy")} />
      </Group>

      {user && (
        <button
          onClick={async () => {
            try { await signOut(); onClose(); navigate("/login"); toast.success("Déconnexion réussie"); }
            catch { toast.error("Erreur"); }
          }}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/15 transition font-semibold"
        >
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      )}

      <p className="text-center text-[10px] text-slate-600 mt-4">{APP_NAME} · v{APP_VERSION}</p>
    </div>
  );
}

/* ------------------- Profile ------------------- */
function ProfilePanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs text-slate-400 mb-1">Nom</p>
        <p className="font-semibold">{profile?.full_name || profile?.name || "—"}</p>
        <Separator className="my-3 bg-white/10" />
        <p className="text-xs text-slate-400 mb-1">E-mail</p>
        <p className="font-semibold text-sm break-all">{user?.email || "Non connecté"}</p>
      </div>
      <Button
        className="w-full"
        onClick={() => { onClose(); navigate(user ? "/profile" : "/login"); }}
      >
        {user ? "Modifier mon profil" : "Se connecter"}
      </Button>
    </div>
  );
}

/* ------------------- About ------------------- */
function AboutPanel() {
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-600/20 to-emerald-600/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{APP_NAME}</p>
            <p className="text-xs">Version {APP_VERSION}</p>
          </div>
        </div>
      </div>
      <p className="leading-relaxed">
        {APP_NAME} est une application premium de prédictions et d'analyses avancées pour les jeux crash (Aviator, JetX, CosmoX) sur les plateformes Bet261 et 1xBet. Interface luxe, analyses en temps réel, IA embarquée.
      </p>
      <p className="text-xs text-slate-500">© {new Date().getFullYear()} J&H Studio — Antananarivo, Madagascar.</p>
    </div>
  );
}

/* ------------------- Settings ------------------- */
function SettingsPanel() {
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);
  const [notif, setNotif] = useState<boolean>(() => localStorage.getItem("jh.notif") !== "0");
  const [sound, setSound] = useState<boolean>(() => localStorage.getItem("jh.sound") !== "0");

  return (
    <div className="space-y-2">
      <Group title="Préférences">
        <SwitchRow icon={<Bell className="w-5 h-5 text-amber-300" />} label="Notifications" checked={notif} onCheckedChange={(v) => { setNotif(v); localStorage.setItem("jh.notif", v ? "1" : "0"); toast.success(v ? "Activées" : "Désactivées"); }} />
        <SwitchRow icon={<Volume2 className="w-5 h-5 text-amber-300" />} label="Sons" checked={sound} onCheckedChange={(v) => { setSound(v); localStorage.setItem("jh.sound", v ? "1" : "0"); toast.success(v ? "Activés" : "Désactivés"); }} />
        <SwitchRow icon={p.darkMode !== false ? <Moon className="w-5 h-5 text-amber-300" /> : <Sun className="w-5 h-5 text-amber-300" />} label="Mode sombre" checked={p.darkMode !== false} onCheckedChange={(v) => { writePersonalization({ darkMode: v }); toast.success(v ? "Sombre" : "Clair"); }} />
      </Group>
    </div>
  );
}

function SwitchRow({ icon, label, checked, onCheckedChange }: { icon: React.ReactNode; label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">{icon}</div>
      <p className="flex-1 font-medium text-[14px]">{label}</p>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ------------------- Notifications ------------------- */
function NotificationsPanel() {
  // Local notification center reuse: point users to the bell icon.
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
        <Bell className="w-10 h-10 mx-auto text-amber-300 mb-3" />
        <p className="font-semibold text-white">Centre de notifications</p>
        <p className="text-xs text-slate-400 mt-1">
          Vos alertes en temps réel sont accessibles via l'icône <Bell className="w-3 h-3 inline" /> en haut de l'écran.
        </p>
      </div>
    </div>
  );
}

/* ------------------- History ------------------- */
function HistoryPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);
  const items = p.history ?? [];
  if (items.length === 0) {
    return <EmptyState icon={<HistoryIcon className="w-8 h-8" />} label="Aucune page visitée" />;
  }
  return (
    <div className="space-y-2">
      <button
        onClick={() => { writePersonalization({ history: [] }); toast.success("Historique effacé"); }}
        className="text-xs text-amber-300 hover:underline flex items-center gap-1 ml-1"
      >
        <Trash2 className="w-3 h-3" /> Effacer l'historique
      </button>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/5 overflow-hidden">
        {items.map((h) => (
          <button
            key={h.ts}
            onClick={() => { onClose(); navigate(h.path); }}
            className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-white/[0.05] text-left"
          >
            <HistoryIcon className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{h.title || h.path}</p>
              <p className="text-[10px] text-slate-500">{new Date(h.ts).toLocaleString("fr-FR")}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------- Favorites ------------------- */
const FAVORABLE = [
  { path: "/games", title: "Jeux" },
  { path: "/aviator", title: "Aviator" },
  { path: "/jetx", title: "JetX" },
  { path: "/cosmox", title: "CosmoX" },
  { path: "/premium", title: "Premium" },
  { path: "/gen-store", title: "Boutique" },
  { path: "/chat", title: "Chat" },
];

function FavoritesPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);
  const favSet = new Set(p.favorites ?? []);

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">Épinglez vos écrans préférés pour y accéder rapidement.</p>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/5 overflow-hidden">
        {FAVORABLE.map((f) => {
          const isFav = favSet.has(f.path);
          return (
            <div key={f.path} className="flex items-center gap-2 px-3.5 py-3">
              <button
                onClick={() => { onClose(); navigate(f.path); }}
                className="flex-1 text-left"
              >
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-[10px] text-slate-500">{f.path}</p>
              </button>
              <button
                onClick={() => {
                  const cur = readPersonalization().favorites ?? [];
                  const next = cur.includes(f.path) ? cur.filter((x) => x !== f.path) : [...cur, f.path];
                  writePersonalization({ favorites: next });
                }}
                aria-label="Toggle favori"
                className={`p-2 rounded-lg transition ${isFav ? "text-yellow-300 bg-yellow-400/10" : "text-slate-500 hover:bg-white/5"}`}
              >
                <Star className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------- Language ------------------- */
function LanguagePanel() {
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);
  const set = (lang: "fr" | "en") => {
    writePersonalization({ language: lang });
    document.documentElement.lang = lang;
    toast.success(lang === "fr" ? "Français activé" : "English enabled");
  };
  return (
    <div className="space-y-2">
      {[
        { code: "fr" as const, label: "Français", flag: "🇫🇷" },
        { code: "en" as const, label: "English", flag: "🇬🇧" },
      ].map((l) => (
        <button
          key={l.code}
          onClick={() => set(l.code)}
          className={`w-full flex items-center gap-3 rounded-2xl border p-4 transition ${p.language === l.code || (!p.language && l.code === "fr") ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
        >
          <span className="text-2xl">{l.flag}</span>
          <span className="flex-1 text-left font-semibold">{l.label}</span>
          {(p.language === l.code || (!p.language && l.code === "fr")) && (
            <span className="text-xs text-amber-300">Actif</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ------------------- Theme (AI background + AI palette) ------------------- */
function ThemePanel() {
  const [p, setP] = useState<Personalization>(() => readPersonalization());
  useEffect(() => subscribePersonalization(setP), []);

  const [bgPrompt, setBgPrompt] = useState("");
  const [bgLoading, setBgLoading] = useState(false);

  const [palPrompt, setPalPrompt] = useState("");
  const [palLoading, setPalLoading] = useState(false);

  const generateBg = async () => {
    if (!bgPrompt.trim()) { toast.error("Décrivez le fond souhaité"); return; }
    setBgLoading(true);
    try {
      const res = await fetch("/api/ai-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: bgPrompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { dataUrl } = (await res.json()) as { dataUrl: string };
      writePersonalization({ bgUrl: dataUrl });
      applyBackground(dataUrl);
      toast.success("Fond appliqué");
    } catch (e: any) {
      toast.error("Échec", { description: e?.message?.slice(0, 120) });
    } finally { setBgLoading(false); }
  };

  const generatePalette = async () => {
    if (!palPrompt.trim()) { toast.error("Décrivez la palette souhaitée"); return; }
    setPalLoading(true);
    try {
      const res = await fetch("/api/ai-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: palPrompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { palette } = (await res.json()) as { palette: PaletteT };
      writePersonalization({ palette });
      applyPalette(palette);
      toast.success("Palette appliquée");
    } catch (e: any) {
      toast.error("Échec", { description: e?.message?.slice(0, 120) });
    } finally { setPalLoading(false); }
  };

  const resetAll = () => {
    writePersonalization({ bgUrl: null, palette: null });
    applyBackground(null);
    applyPalette(null);
    toast.success("Thème réinitialisé");
  };

  return (
    <div className="space-y-5">
      {/* AI Background */}
      <section className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="w-4 h-4 text-fuchsia-300" />
          <h3 className="font-bold text-sm">Fond d'écran IA</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Décrivez l'ambiance visuelle et l'IA génèrera un fond adapté.
        </p>
        <Textarea
          rows={3}
          placeholder="ex : galaxie violette avec étoiles dorées, ambiance cosmique premium"
          value={bgPrompt}
          onChange={(e) => setBgPrompt(e.target.value)}
          disabled={bgLoading}
          className="bg-black/30 border-white/10 text-sm"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {[
            "aurore boréale émeraude et or, minimaliste",
            "cristaux noirs et reflets dorés, luxueux",
            "brume violette, étoiles filantes, mystique",
            "vagues abstraites vert émeraude, calme",
          ].map((s) => (
            <button key={s} onClick={() => setBgPrompt(s)} className="text-[10px] px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
              {s.slice(0, 34)}…
            </button>
          ))}
        </div>
        <Button onClick={generateBg} disabled={bgLoading} className="w-full mt-3">
          {bgLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" /> Génération…</>) : (<><Sparkles className="w-4 h-4 mr-2" /> Générer et appliquer</>)}
        </Button>
        {p.bgUrl && (
          <div className="mt-3">
            <img src={p.bgUrl} alt="fond actuel" className="w-full h-28 object-cover rounded-lg border border-white/10" />
            <button onClick={() => { writePersonalization({ bgUrl: null }); applyBackground(null); }} className="text-[11px] text-amber-300 mt-1 hover:underline">
              Supprimer le fond
            </button>
          </div>
        )}
      </section>

      {/* AI Palette */}
      <section className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-sky-300" />
          <h3 className="font-bold text-sm">Palette de couleurs IA</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Décrivez l'humeur ou un thème, l'IA crée les couleurs de l'app.
        </p>
        <Textarea
          rows={3}
          placeholder="ex : néon cyberpunk rose et cyan sur fond très sombre"
          value={palPrompt}
          onChange={(e) => setPalPrompt(e.target.value)}
          disabled={palLoading}
          className="bg-black/30 border-white/10 text-sm"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {[
            "or royal et velours noir",
            "menthe fraîche et charbon",
            "coucher de soleil orange magenta",
            "bleu nuit et argent glacial",
          ].map((s) => (
            <button key={s} onClick={() => setPalPrompt(s)} className="text-[10px] px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300">
              {s}
            </button>
          ))}
        </div>
        <Button onClick={generatePalette} disabled={palLoading} className="w-full mt-3">
          {palLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" /> Génération…</>) : (<><Sparkles className="w-4 h-4 mr-2" /> Générer et appliquer</>)}
        </Button>
        {p.palette && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {(["primary","background","accent","foreground","card"] as const).map((k) => (
              <div key={k} className="text-center">
                <div className="w-full aspect-square rounded-lg border border-white/20" style={{ background: p.palette?.[k] ? `hsl(${p.palette[k]})` : undefined }} />
                <p className="text-[9px] text-slate-500 mt-1 truncate">{k}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={resetAll}
        className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white py-2"
      >
        <RotateCcw className="w-4 h-4" /> Réinitialiser le thème
      </button>
    </div>
  );
}

/* ------------------- Privacy ------------------- */
function PrivacyPanel() {
  return (
    <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="font-semibold text-white mb-1">Vos données vous appartiennent</p>
        <p className="text-xs">
          Nous ne stockons que les informations nécessaires au fonctionnement de l'application (compte, préférences, historique local). Aucune donnée n'est vendue à des tiers.
        </p>
      </div>
      <ul className="space-y-2 text-xs">
        <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-300 shrink-0" /> Chiffrement en transit (HTTPS).</li>
        <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-300 shrink-0" /> Historique et favoris stockés localement sur votre appareil.</li>
        <li className="flex gap-2"><Shield className="w-4 h-4 text-emerald-300 shrink-0" /> Suppression du compte disponible sur simple demande via WhatsApp.</li>
      </ul>
      <button
        onClick={() => {
          localStorage.clear();
          toast.success("Données locales effacées");
          setTimeout(() => location.reload(), 400);
        }}
        className="w-full mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 py-3 text-sm font-semibold hover:bg-amber-500/15"
      >
        Effacer toutes mes données locales
      </button>
    </div>
  );
}

/* ------------------- Help ------------------- */
function HelpPanel() {
  const faq = [
    { q: "Comment activer le mode Premium ?", a: "Rendez-vous sur l'onglet Premium, choisissez votre plan et envoyez la preuve de paiement Mobile Money — l'activation est automatique." },
    { q: "Les prédictions sont-elles garanties ?", a: "Non. Il s'agit d'analyses statistiques : jouez de manière responsable." },
    { q: "Comment changer mon mot de passe ?", a: "Menu → Profil → Modifier mon profil, ou utilisez « Mot de passe oublié » sur l'écran de connexion." },
    { q: "Comment contacter le support ?", a: "Menu → Contact & Support, ou touchez le bouton WhatsApp." },
  ];
  return (
    <div className="space-y-2">
      {faq.map((f) => (
        <details key={f.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 group">
          <summary className="cursor-pointer font-medium text-sm flex items-center justify-between">
            {f.q}
            <ChevronRight className="w-4 h-4 group-open:rotate-90 transition" />
          </summary>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ------------------- Contact ------------------- */
function ContactPanel() {
  return (
    <div className="space-y-3">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 hover:bg-emerald-500/15 transition"
      >
        <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-emerald-300" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">WhatsApp</p>
          <p className="text-xs text-slate-400">Ouvrir la conversation avec le support</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </a>
      <a
        href={EMAIL_LINK}
        className="w-full flex items-center gap-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 hover:bg-sky-500/15 transition"
      >
        <div className="w-11 h-11 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-sky-300" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">E-mail</p>
          <p className="text-xs text-slate-400">Écrire au support</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </a>
      <p className="text-[11px] text-slate-500 text-center mt-2">Réponse moyenne sous quelques heures, 7j/7.</p>
    </div>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div className="mb-2 opacity-40">{icon}</div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
