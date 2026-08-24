with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

# Replace state and effects
import re

old_state_block = '''  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [isUanMasked, setIsUanMasked] = useState<boolean>(true);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [uanCopied, setUanCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jan_epf_privacy_mode");
      if (saved === "true") setIsPrivacyMode(true);
    }
  }, []);'''

new_state_block = '''  const [chaosSimulatorOpen, setChaosSimulatorOpen] = useState(false);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [uanCopied, setUanCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jan_epf_privacy_mode");
      if (saved !== null) setPrivacyMode(saved === "true");
    }
  }, []);

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("jan_epf_privacy_mode", String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePrivacyMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);'''

if old_state_block in page:
    page = page.replace(old_state_block, new_state_block)

# Update UAN button to use togglePrivacyMode and privacyMode
page = page.replace(
    'isUanMasked ? `${activeCitizen.uan.substring(0, 4)} •••• ${activeCitizen.uan.substring(8)}`',
    'privacyMode ? `${activeCitizen.uan.substring(0, 4)} •••• ${activeCitizen.uan.substring(8)}`'
)
page = page.replace(
    'onClick={() => setIsUanMasked(!isUanMasked)}',
    'onClick={togglePrivacyMode}'
)
page = page.replace(
    'title={isUanMasked ? "Show full UAN" : "Mask UAN"}',
    'title={privacyMode ? "Show full details (⌘P)" : "Hide sensitive details (⌘P)"}'
)
page = page.replace(
    '{isUanMasked ? <Eye className="w-4 h-4 text-slate-300" /> : <EyeOff className="w-4 h-4 text-saffron" />}',
    '{privacyMode ? <EyeOff className="w-4 h-4 text-saffron" /> : <Eye className="w-4 h-4 text-slate-300" />}'
)

# Update Balance Card button to use togglePrivacyMode
page = re.sub(
    r'onClick=\{\(\) => \{\s*const next = !isPrivacyMode;\s*setIsPrivacyMode\(next\);\s*if \(typeof window !== "undefined"\) \{\s*localStorage\.setItem\("jan_epf_privacy_mode", String\(next\)\);\s*\}\s*\}\}',
    'onClick={togglePrivacyMode}',
    page
)
page = page.replace('isPrivacyMode', 'privacyMode')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
print("Updated page.tsx with unified Privacy Shield and ⌘P shortcut!")

