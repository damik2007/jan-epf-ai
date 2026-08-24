with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "r", encoding="utf-8") as f:
    arch = f.read()

# Import TechStackMatrix
if "import { TechStackMatrix }" not in arch:
    arch = arch.replace(
        'import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";',
        'import { SreTelemetryPanel } from "@/components/SreTelemetryPanel";\nimport { TechStackMatrix } from "@/components/TechStackMatrix";'
    )

# Update activeTab type
arch = arch.replace(
    'const [activeTab, setActiveTab] = useState<"personas" | "forms" | "pillars" | "sre" | "grievances" | "legal">("grievances");',
    'const [activeTab, setActiveTab] = useState<"personas" | "forms" | "pillars" | "sre" | "grievances" | "legal" | "stack">("grievances");'
)

arch = arch.replace(
    'Array<{\n    id: "personas" | "forms" | "pillars" | "sre" | "grievances" | "legal";',
    'Array<{\n    id: "personas" | "forms" | "pillars" | "sre" | "grievances" | "legal" | "stack";'
)

# Add tab entry
old_tabs_end = '{ id: "sre", label: "⚡ SRE Resilience & Circuit Breakers", icon: Activity, badge: "Zero Fallback" }\n  ];'
new_tabs_end = '''{ id: "sre", label: "⚡ SRE Resilience & Circuit Breakers", icon: Activity, badge: "Zero Fallback" },
    { id: "stack", label: "🛠️ Tools & Tech Stack Matrix", icon: Cpu, badge: "18 Tools" }
  ];'''

if old_tabs_end in arch:
    arch = arch.replace(old_tabs_end, new_tabs_end)

# Add TAB 7 rendering before disclaimers
tab_render = '''      {/* TAB 7: TOOLS, TECH STACK & ENGINEERING TOOLCHAIN */}
      {activeTab === "stack" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <TechStackMatrix />
        </div>
      )}'''

if '{/* Formal Statutory & Legal Disclaimers Card */}' in arch and "activeTab === \"stack\"" not in arch:
    arch = arch.replace(
        '{/* Formal Statutory & Legal Disclaimers Card */}',
        f'{tab_render}\n\n      {{/* Formal Statutory & Legal Disclaimers Card */}}'
    )

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/architecture/page.tsx", "w", encoding="utf-8") as f:
    f.write(arch)
print("Added Tech Stack Matrix tab to Architecture & Research page!")

