with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

page = page.replace(
    'const [privacyMode, setPrivacyMode] = useState<boolean>(false);',
    'const [privacyMode, setPrivacyMode] = useState<boolean>(true);'
)

page = page.replace(
    'if (saved !== null) setPrivacyMode(saved === "true");',
    'if (saved !== null) { setPrivacyMode(saved === "true"); } else { setPrivacyMode(true); }'
)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
print("Updated page.tsx: Privacy Mode is now ON by default!")

