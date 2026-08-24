with open("frontend/src/components/VoiceAssistant.tsx", "r") as f:
    code = f.read()

code = code.replace(
    "serviceYears: activeCitizen.active_employment?.service_years ?? 5",
    "serviceYears: activeCitizen.active_employment?.total_service_years ?? 5"
)

with open("frontend/src/components/VoiceAssistant.tsx", "w") as f:
    f.write(code)
print("Fixed service years property in VoiceAssistant.tsx!")
