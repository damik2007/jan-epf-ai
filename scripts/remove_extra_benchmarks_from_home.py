import re

filepath = "/Users/damikreddy/Desktop/Hackaton/frontend/src/app/page.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    code = f.read()

# Remove import
code = re.sub(r'import { BenchmarkComparison } from "@/components/BenchmarkComparison";\n?', '', code)

# Remove JSX invocation
code = re.sub(r'{\/\* Live In-Situ Benchmark Comparison \*\/}\s*<BenchmarkComparison \/>\s*', '', code)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(code)

print("Cleaned page.tsx: extra benchmark component removed!")
