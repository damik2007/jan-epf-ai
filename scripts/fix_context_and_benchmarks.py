with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/context/CitizenContext.tsx", "r", encoding="utf-8") as f:
    cc = f.read()

replacement = '''  const updateActiveCitizenName = useCallback((newName: string) => {
    setActiveCitizen((prev) => {
      const updated: Citizen = { ...prev, full_name: newName };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);

  const updateActiveCitizenNomination = useCallback((nomineeName: string, relationship: string) => {
    setActiveCitizen((prev) => {
      const updated: Citizen = {
        ...prev,
        nomination_details: {
          nomination_filed: true,
          suggested_nominee: {
            name: nomineeName,
            relationship: relationship,
            share_percent: 100
          }
        }
      };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);'''

cc = cc.replace('''  const updateActiveCitizenNomination = useCallback((nomineeName: string, relationship: string) => {
    setActiveCitizen((prev) => {
      const updated: Citizen = {
        ...prev,
        nomination_details: {
          nomination_filed: true,
          suggested_nominee: {
            name: nomineeName,
            relationship: relationship,
            share_percent: 100
          }
        }
      };
      setCitizens((all) => {
        const newAll = all.map((c) => (c.uan === updated.uan ? updated : c));
        broadcastStateChange(newAll, updated);
        return newAll;
      });
      return updated;
    });
  }, []);''', replacement)

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/context/CitizenContext.tsx", "w", encoding="utf-8") as f:
    f.write(cc)
print("Updated CitizenContext.tsx!")

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "r", encoding="utf-8") as f:
    bp = f.read()

# Fix runClientBenchmarks -> runInBrowserBenchmarks and default mapping
bp = bp.replace('onClick={runClientBenchmarks}', 'onClick={runInBrowserBenchmarks}')
bp = bp.replace('{(benchResults || defaultBenchmarks).map((res) => (', '{(benchResults || runBenchmarkSuite(1000)).map((res: any) => (')

with open("/Users/damikreddy/Desktop/Hackaton/frontend/src/app/benchmarks/page.tsx", "w", encoding="utf-8") as f:
    f.write(bp)
print("Updated benchmarks/page.tsx!")

