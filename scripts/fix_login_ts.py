with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "r", encoding="utf-8") as f:
    login = f.read()

login = login.replace(
    'Sent to Aadhaar-linked mobile ending in <strong>XXXX-{activeCitizen.phone_masked ? activeCitizen.phone_masked.slice(-4) : "4819"}</strong>.',
    'Sent to Aadhaar-linked mobile ending in <strong>XXXX-{activeCitizen.phone ? activeCitizen.phone.slice(-4) : "4819"}</strong>.'
)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/login/page.tsx", "w", encoding="utf-8") as f:
    f.write(login)
print("Fixed login/page.tsx TypeScript field!")

