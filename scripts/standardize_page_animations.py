import re

files = [
    "frontend/src/app/page.tsx",
    "frontend/src/app/money/page.tsx",
    "frontend/src/app/career/page.tsx",
    "frontend/src/app/savings/page.tsx",
    "frontend/src/app/fix/page.tsx",
    "frontend/src/app/benchmarks/page.tsx",
    "frontend/src/app/architecture/page.tsx",
    "frontend/src/app/login/page.tsx",
]

for filepath in files:
    try:
        with open(filepath, "r") as f:
            content = f.read()

        # Replace animate-in fade-in duration-300 with animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out
        new_content = re.sub(
            r'animate-in\s+fade-in(\s+duration-300)?',
            'animate-in fade-in-50 slide-in-from-bottom-2 duration-300 ease-out',
            content
        )

        if new_content != content:
            with open(filepath, "w") as f:
                f.write(new_content)
            print(f"Updated page animation in: {filepath}")
        else:
            print(f"No changes needed in: {filepath}")
    except Exception as e:
        print(f"Error updating {filepath}: {e}")
