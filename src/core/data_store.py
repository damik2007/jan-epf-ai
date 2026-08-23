"""
Jan-EPF AI: In-Memory / Distributed State Store.
Loads and manages high-fidelity citizen accounts, claims ledger, and digital joint declarations.
"""
import json
import os
from typing import Any, Dict, List, Optional


class MockCitizenDataStore:
    def __init__(self, data_path: Optional[str] = None):
        if data_path is None:
            data_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "data",
                "MOCK_CITIZEN_ACCOUNTS.json"
            )
        self.data_path = data_path
        self.citizens: Dict[str, Dict[str, Any]] = {}
        self.claims_ledger: List[Dict[str, Any]] = []
        self.joint_declarations: List[Dict[str, Any]] = []
        self.grievances: List[Dict[str, Any]] = []
        self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data.get("citizens", []):
                    self.citizens[item["uan"]] = item
        else:
            # Fallback inline mock data if file not found
            self.citizens = {}

    def get_citizen(self, uan: str) -> Optional[Dict[str, Any]]:
        return self.citizens.get(uan)

    def get_all_citizens(self) -> List[Dict[str, Any]]:
        return list(self.citizens.values())

    def update_citizen(self, uan: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if uan in self.citizens:
            self.citizens[uan].update(updates)
            return self.citizens[uan]
        return None

    def add_claim(self, claim_data: Dict[str, Any]) -> Dict[str, Any]:
        self.claims_ledger.append(claim_data)
        return claim_data

    def get_claims_for_uan(self, uan: str) -> List[Dict[str, Any]]:
        return [c for c in self.claims_ledger if c.get("uan") == uan]

    def add_joint_declaration(self, jd_data: Dict[str, Any]) -> Dict[str, Any]:
        self.joint_declarations.append(jd_data)
        return jd_data

    def get_joint_declarations(self, uan: str) -> List[Dict[str, Any]]:
        return [jd for jd in self.joint_declarations if jd.get("uan") == uan]

    def add_grievance(self, g_data: Dict[str, Any]) -> Dict[str, Any]:
        self.grievances.append(g_data)
        return g_data

    def get_grievances(self, uan: str) -> List[Dict[str, Any]]:
        return [g for g in self.grievances if g.get("uan") == uan]


mock_store = MockCitizenDataStore()
