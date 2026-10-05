"""
Kyun? — AI-Powered Financial Decision Explainability Layer
Backend API Server
"""

import os
import json
import math
import random
from typing import Optional
from contextlib import asynccontextmanager

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

# ===== Mock Data =====

USER_PROFILE = {
    "name": "Demo User",
    "net_worth": 2450000,
    "bank_balance": 1250000,
    "investments": 1200000,
}

LOAN_PROFILE = {
    "credit_utilisation": 71,
    "available_credit": 150000,
    "used_credit": 106500,
    "late_payments_6m": 2,
    "credit_history_months": 14,
    "outstanding_balance": 31950,
    "monthly_income": 65000,
    "requested_amount": 250000,
    "debt_to_income": 0.49,
    "active_accounts": 3,
}

INSURANCE_PROFILE = {
    "claim_amount": 84500,
    "approved_amount": 61250,
    "coverage_limit": 75000,
    "deductible": 5000,
    "depreciation": 8250,
    "pending_documents": 1,
}

MF_PROFILE = {
    "portfolio_value": 480000,
    "equity_allocation": 82,
    "debt_allocation": 12,
    "other_allocation": 6,
    "monthly_sip": 8000,
    "equity_sip_share": 72,
    "risk_profile": "moderate",
    "portfolio_risk": "high",
}

# ===== Factor mapping =====

LOAN_FACTOR_MAP = {
    "credit_utilisation": {
        "label": "High credit utilisation",
        "threshold": 50,
        "direction": "lower_is_better",
        "description_template": "Your current balances use around {value}% of your available credit.",
    },
    "late_payments_6m": {
        "label": "Recent payment pattern",
        "threshold": 0,
        "direction": "lower_is_better",
        "description_template": "There have been {value} late payments in the last 6 months.",
    },
    "credit_history_months": {
        "label": "Length of credit history",
        "threshold": 24,
        "direction": "higher_is_better",
        "description_template": "Your credit history spans approximately {value} months.",
    },
    "outstanding_balance": {
        "label": "Outstanding balance",
        "threshold": 20000,
        "direction": "lower_is_better",
        "description_template": "Your outstanding balance is ₹{value:,}.",
    },
    "debt_to_income": {
        "label": "Debt-to-income ratio",
        "threshold": 0.4,
        "direction": "lower_is_better",
        "description_template": "Your debt-to-income ratio is {value:.0%}.",
    },
}

# ===== Lightweight Loan Model (Logistic Regression coefficients - pre-trained) =====

LOAN_MODEL_WEIGHTS = {
    "intercept": 0.5,
    "credit_utilisation": -0.035,
    "monthly_income": 0.000008,
    "outstanding_balance": -0.000015,
    "late_payments_6m": -0.45,
    "credit_history_months": 0.025,
    "debt_to_income": -1.2,
    "active_accounts": 0.1,
    "requested_amount": -0.000002,
}


def sigmoid(x):
    return 1 / (1 + math.exp(-max(-500, min(500, x))))


def predict_loan(profile: dict) -> float:
    """Simple logistic regression prediction."""
    z = LOAN_MODEL_WEIGHTS["intercept"]
    for feat, weight in LOAN_MODEL_WEIGHTS.items():
        if feat == "intercept":
            continue
        val = profile.get(feat, 0)
        if isinstance(val, str):
            continue
        z += weight * val
    return sigmoid(z)


def get_shap_contributions(profile: dict) -> list:
    """Compute pseudo-SHAP contributions using model weights * feature values."""
    contributions = []
    for feat, weight in LOAN_MODEL_WEIGHTS.items():
        if feat == "intercept":
            continue
        val = profile.get(feat, 0)
        if isinstance(val, str):
            continue
        contribution = abs(weight * val)
        contributions.append({
            "feature": feat,
            "contribution": round(contribution, 4),
            "weight": weight,
            "value": val,
        })
    contributions.sort(key=lambda x: x["contribution"], reverse=True)
    return contributions


def generate_loan_factors(profile: dict) -> list:
    """Generate explanation factors with SHAP-like contributions."""
    contributions = get_shap_contributions(profile)
    total = sum(c["contribution"] for c in contributions) or 1
    factors = []

    for c in contributions[:4]:
        feat = c["feature"]
        mapping = LOAN_FACTOR_MAP.get(feat)
        if not mapping:
            continue

        norm_contribution = c["contribution"] / total
        if norm_contribution > 0.25:
            impact = "high"
        elif norm_contribution > 0.12:
            impact = "medium"
        else:
            impact = "low"

        factors.append({
            "id": feat,
            "label": mapping["label"],
            "impact": impact,
            "value": c["value"],
            "unit": "%" if "utilisation" in feat or "ratio" in feat else ("months" if "months" in feat else ""),
            "description": mapping["description_template"].format(value=c["value"]),
            "explanation": {"type": "shap", "contribution": round(norm_contribution, 2)},
        })

    return factors


# ===== Insurance Engine =====

def generate_insurance_factors(profile: dict) -> list:
    """Deterministic rule-based insurance explanation."""
    factors = []
    if profile["claim_amount"] > profile["coverage_limit"]:
        factors.append({
            "id": "coverage_limit",
            "label": "Coverage limit",
            "impact": "high",
            "value": profile["coverage_limit"],
            "unit": "₹",
            "description": f"Your policy coverage is ₹{profile['coverage_limit']:,}, which is less than the claimed amount.",
        })
    if profile.get("depreciation", 0) > 0:
        factors.append({
            "id": "depreciation",
            "label": "Depreciation applied",
            "impact": "medium",
            "value": profile["depreciation"],
            "unit": "₹",
            "description": f"Standard depreciation of ₹{profile['depreciation']:,} was applied based on vehicle age.",
        })
    if profile.get("deductible", 0) > 0:
        factors.append({
            "id": "deductible",
            "label": "Deductible",
            "impact": "medium",
            "value": profile["deductible"],
            "unit": "₹",
            "description": f"A ₹{profile['deductible']:,} deductible was applied as per your policy.",
        })
    if profile.get("pending_documents", 0) > 0:
        factors.append({
            "id": "documentation",
            "label": "Claim documentation",
            "impact": "low",
            "value": profile["pending_documents"],
            "unit": "document pending",
            "description": f"{profile['pending_documents']} supporting document has not yet been submitted.",
        })
    return factors


# ===== Mutual Fund Engine =====

def generate_mf_factors(profile: dict) -> list:
    """Deterministic portfolio analysis factors."""
    factors = []
    if profile["equity_allocation"] > 70:
        factors.append({
            "id": "equity_concentration",
            "label": "Equity concentration",
            "impact": "high",
            "value": profile["equity_allocation"],
            "unit": "%",
            "description": f"Your portfolio has {profile['equity_allocation']}% in equity, which is higher than typical for a {profile['risk_profile']} risk profile.",
        })
    if profile["portfolio_risk"] != profile["risk_profile"]:
        factors.append({
            "id": "risk_alignment",
            "label": "Risk profile alignment",
            "impact": "high",
            "value": None,
            "unit": "",
            "description": f"Your portfolio risk ({profile['portfolio_risk'].title()}) does not align with your selected risk profile ({profile['risk_profile'].title()}).",
        })
    if profile["equity_sip_share"] > 60:
        factors.append({
            "id": "sip_allocation",
            "label": "SIP allocation",
            "impact": "medium",
            "value": profile["equity_sip_share"],
            "unit": "% toward equity",
            "description": f"₹{profile['monthly_sip']:,}/month SIP with {profile['equity_sip_share']}% directed toward equity funds.",
        })
    return factors


# ===== What-If =====

class WhatIfRequest(BaseModel):
    decision_id: str
    changes: dict


class AskKyunRequest(BaseModel):
    question: str
    product: str
    context: Optional[dict] = None


class TranslateRequest(BaseModel):
    text: str
    target_language: str


# ===== LLM Responses (Fallback) =====

FALLBACK_RESPONSES = {
    "why is credit utilisation important": "Credit utilisation measures how much of your available credit you are currently using. A high utilisation can indicate higher credit risk. Based on your current profile, your utilisation is around 71%, which was identified as a high-impact factor.",
    "what should i change first": "Based on the factors identified, reducing your credit utilisation would likely have the biggest positive impact. Paying down ₹7,000–10,000 of your outstanding balance could help. This is a likely factor — not a guaranteed outcome.",
    "can i apply again": "After making improvements to the factors identified, you may consider checking your updated profile. The Kyun? progress tracker can help you monitor changes.",
    "default": "Based on the available information, I can help explain the factors identified by Kyun?. Would you like me to explain any specific factor in more detail?",
}


# ===== FastAPI App =====

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[INFO] Kyun? Backend starting...")
    print(f"   Demo Mode: {DEMO_MODE}")
    print(f"   Groq API: {'configured' if GROQ_API_KEY else 'not set (using fallbacks)'}")
    print(f"   Sarvam API: {'configured' if SARVAM_API_KEY else 'not set (using fallbacks)'}")
    yield
    print("[INFO] Kyun? Backend shutting down...")


app = FastAPI(
    title="Kyun? — Financial Explainability API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/dashboard")
async def get_dashboard():
    """Get dashboard data."""
    return {
        "user": USER_PROFILE,
        "kyun_events": [
            {
                "product": "loan",
                "category": "Personal Loan",
                "title": "Application not approved",
                "subtitle": "Reviewed on 21 Sep 2026",
                "cta": "See why",
                "link": "/loan",
            },
            {
                "product": "insurance",
                "category": "Motor Insurance",
                "title": "Claim partially approved",
                "subtitle": "₹61,250 of ₹84,500 approved",
                "cta": "See why",
                "link": "/insurance",
            },
            {
                "product": "mutual_funds",
                "category": "Mutual Funds",
                "title": "Portfolio needs attention",
                "subtitle": "Equity exposure 82%",
                "cta": "Understand",
                "link": "/mutual-funds",
            },
        ],
    }


@app.get("/api/decisions/{decision_id}")
async def get_decision(decision_id: str):
    """Get decision details."""
    decisions = {
        "PL-284761": {
            "id": "PL-284761",
            "product": "loan",
            "category": "personal_loan",
            "decision": {"status": "not_approved", "label": "Not Approved"},
            "date": "2026-09-21",
            "requested_amount": 250000,
            "confidence": 0.78,
        },
        "CL-839274": {
            "id": "CL-839274",
            "product": "insurance",
            "category": "motor_insurance",
            "decision": {"status": "partially_approved", "label": "Partially Approved"},
            "date": "2026-09-18",
            "claimed_amount": 84500,
            "approved_amount": 61250,
            "confidence": 0.85,
        },
        "MF-471920": {
            "id": "MF-471920",
            "product": "mutual_funds",
            "category": "portfolio",
            "decision": {"status": "needs_attention", "label": "Portfolio Needs Attention"},
            "date": "2026-09-22",
            "portfolio_value": 480000,
            "confidence": 0.82,
        },
    }
    if decision_id not in decisions:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decisions[decision_id]


@app.get("/api/decisions/{decision_id}/explanation")
async def get_explanation(decision_id: str):
    """Get explanation factors for a decision."""
    if decision_id == "PL-284761":
        prediction = predict_loan(LOAN_PROFILE)
        factors = generate_loan_factors(LOAN_PROFILE)
        return {
            "decision_id": decision_id,
            "prediction_score": round(prediction, 4),
            "factors": factors,
            "confidence": 0.78,
            "disclaimer": "Likely factors based on available information; not the official decision rationale.",
        }
    elif decision_id == "CL-839274":
        factors = generate_insurance_factors(INSURANCE_PROFILE)
        return {
            "decision_id": decision_id,
            "factors": factors,
            "confidence": 0.85,
            "disclaimer": "Illustrative explanation based on the available policy and claim information.",
        }
    elif decision_id == "MF-471920":
        factors = generate_mf_factors(MF_PROFILE)
        return {
            "decision_id": decision_id,
            "factors": factors,
            "confidence": 0.82,
            "disclaimer": "Portfolio insights are illustrative and do not guarantee investment performance.",
        }
    raise HTTPException(status_code=404, detail="Decision not found")


@app.post("/api/what-if")
async def what_if(req: WhatIfRequest):
    """Run what-if scenario."""
    if req.decision_id.startswith("PL"):
        modified = {**LOAN_PROFILE, **req.changes}
        original_score = predict_loan(LOAN_PROFILE)
        new_score = predict_loan(modified)
        new_factors = generate_loan_factors(modified)
        return {
            "original_score": round(original_score, 4),
            "scenario_score": round(new_score, 4),
            "improved": new_score > original_score,
            "score_change": round(new_score - original_score, 4),
            "factors": new_factors,
            "disclaimer": "Illustrative scenario — not a guarantee of approval.",
        }
    elif req.decision_id.startswith("CL"):
        modified = {**INSURANCE_PROFILE, **req.changes}
        coverage = min(modified.get("coverage_limit", 75000), modified.get("claim_amount", 84500))
        new_approved = coverage - modified.get("deductible", 5000) - modified.get("depreciation", 8250)
        return {
            "original_approved": INSURANCE_PROFILE["approved_amount"],
            "scenario_approved": max(0, new_approved),
            "improved": new_approved > INSURANCE_PROFILE["approved_amount"],
            "disclaimer": "Hypothetical scenario — does not change existing policy or guarantee claim settlement.",
        }
    elif req.decision_id.startswith("MF"):
        total = sum(req.changes.get(k, 0) for k in ["equity_allocation", "debt_allocation", "other_allocation"])
        return {
            "original_allocation": {
                "equity": MF_PROFILE["equity_allocation"],
                "debt": MF_PROFILE["debt_allocation"],
                "other": MF_PROFILE["other_allocation"],
            },
            "scenario_allocation": req.changes,
            "balanced": abs(total - 100) < 2,
            "more_diversified": req.changes.get("equity_allocation", 82) < MF_PROFILE["equity_allocation"],
            "disclaimer": "Illustrative portfolio scenario — not a return prediction.",
        }
    raise HTTPException(status_code=404, detail="Decision not found")


@app.post("/api/plan")
async def create_plan(req: dict = None):
    """Generate an action plan."""
    return {
        "loan": {
            "title": "Your 60-Day Plan",
            "target_days": 60,
            "steps": [
                {"week": "Week 1", "task": "Pay ₹7,000 toward outstanding balance", "done": True},
                {"week": "Week 4", "task": "Keep utilisation below target", "done": False},
                {"week": "Week 8", "task": "Review your financial profile", "done": False},
                {"week": "Day 60", "task": "Check again", "done": False},
            ],
        }
    }


@app.post("/api/ask-kyun")
async def ask_kyun(req: AskKyunRequest):
    """Ask Kyun? conversational endpoint."""
    question_lower = req.question.lower().strip()

    # Try Groq if available
    if GROQ_API_KEY and not DEMO_MODE:
        try:
            from groq import Groq
            client = Groq(api_key=GROQ_API_KEY)

            system_prompt = """You are Kyun?, a financial explanation assistant.
Use only the structured context supplied.
Never invent a decision reason.
Never guarantee approval, claim settlement, or investment return.
Clearly distinguish likely factors from official reasons.
Explain financial concepts in simple language.
When asked for an action, use only actions present in the supplied context.
Keep answers concise (2-4 sentences)."""

            context_str = json.dumps(req.context or {}, indent=2)
            user_msg = f"Context: {context_str}\n\nUser question: {req.question}"

            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.3,
                max_tokens=300,
            )
            return {"answer": completion.choices[0].message.content, "source": "groq"}
        except Exception as e:
            print(f"Groq error: {e}")

    # Fallback
    for key, response in FALLBACK_RESPONSES.items():
        if key in question_lower:
            return {"answer": response, "source": "fallback"}

    return {"answer": FALLBACK_RESPONSES["default"], "source": "fallback"}


@app.post("/api/translate")
async def translate(req: TranslateRequest):
    """Translate text (Sarvam fallback)."""
    translations = {
        "hi": "आपका ₹2,50,000 का व्यक्तिगत ऋण आवेदन स्वीकृत नहीं हुआ।",
        "mr": "तुमचा ₹2,50,000 चा वैयक्तिक कर्ज अर्ज मंजूर झाला नाही.",
        "gu": "તમારી ₹2,50,000 ની વ્યક્તિગત લોન અરજી મંજૂર થઈ નથી.",
    }
    return {
        "original": req.text,
        "translated": translations.get(req.target_language, req.text),
        "language": req.target_language,
        "source": "fallback",
    }


@app.post("/api/voice")
async def generate_voice(req: TranslateRequest):
    """Generate TTS (Sarvam fallback)."""
    return {
        "audio_url": None,
        "transcript": req.text,
        "language": req.target_language,
        "source": "fallback",
        "message": "Voice generation requires Sarvam API key. Displaying transcript instead.",
    }


@app.post("/api/recheck/{decision_id}")
async def recheck(decision_id: str):
    """Recheck with updated profile (simulated improvement)."""
    if decision_id == "PL-284761":
        improved_profile = {**LOAN_PROFILE}
        improved_profile["credit_utilisation"] = 42
        improved_profile["outstanding_balance"] = 21500
        improved_profile["late_payments_6m"] = 0
        score = predict_loan(improved_profile)
        factors = generate_loan_factors(improved_profile)
        return {
            "decision_id": decision_id,
            "updated_score": round(score, 4),
            "factors": factors,
            "message": "Your updated profile is ready for review.",
        }
    raise HTTPException(status_code=404, detail="Decision not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
