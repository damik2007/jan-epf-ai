with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "r", encoding="utf-8") as f:
    login = f.read()

login = login.replace(
    '<div className="font-bold text-slate-900 dark:text-white">{uanInput} (Ramesh Kumar)</div>',
    '<div className="font-bold text-slate-900 dark:text-white">{uanInput} ({personaScenarios.find((p) => p.uan === uanInput)?.name || activeCitizen.full_name})</div>'
)

login = login.replace(
    'Sent to Aadhaar-linked mobile ending in <strong>XXXX-4819</strong>.',
    'Sent to Aadhaar-linked mobile ending in <strong>XXXX-{activeCitizen.phone_masked ? activeCitizen.phone_masked.slice(-4) : "4819"}</strong>.'
)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(login)
print("Updated login/page.tsx persona refinement!")

