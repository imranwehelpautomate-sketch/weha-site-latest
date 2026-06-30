#!/usr/bin/env python3
"""
Backend Regression + Contract Test for WeHA API
Tests all endpoints against the preview FastAPI backend.
"""

import requests
import json
from datetime import datetime, timedelta
import os

# Read backend URL from frontend/.env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1]
            break

API_BASE = f"{BACKEND_URL}/api"

print(f"Testing backend at: {API_BASE}\n")
print("=" * 80)

# Helper to get a future weekday date
def get_future_weekday():
    """Get next Wednesday (or another weekday if today is Wednesday)"""
    today = datetime.now()
    days_ahead = 2 - today.weekday()  # Wednesday is 2
    if days_ahead <= 0:  # Target day already happened this week
        days_ahead += 7
    future_date = today + timedelta(days=days_ahead)
    return future_date.strftime("%Y-%m-%d")

def get_weekend_date():
    """Get next Saturday"""
    today = datetime.now()
    days_ahead = 5 - today.weekday()  # Saturday is 5
    if days_ahead <= 0:
        days_ahead += 7
    weekend_date = today + timedelta(days=days_ahead)
    return weekend_date.strftime("%Y-%m-%d")

# Test counters
total_tests = 0
passed_tests = 0
failed_tests = []

def test(name, condition, details=""):
    global total_tests, passed_tests, failed_tests
    total_tests += 1
    if condition:
        passed_tests += 1
        print(f"✅ TEST {total_tests}: {name}")
        if details:
            print(f"   {details}")
    else:
        failed_tests.append(f"TEST {total_tests}: {name} - {details}")
        print(f"❌ TEST {total_tests}: {name}")
        if details:
            print(f"   {details}")
    print()

# ============================================================================
# TEST 1: GET /api/ => 200 {message:"WeHA API"}
# ============================================================================
print("TEST 1: GET /api/ root endpoint")
print("-" * 80)
try:
    response = requests.get(f"{API_BASE}/")
    test(
        "GET /api/ returns 200 with correct message",
        response.status_code == 200 and response.json().get("message") == "WeHA API",
        f"Status: {response.status_code}, Response: {response.json()}"
    )
except Exception as e:
    test("GET /api/ returns 200 with correct message", False, f"Error: {str(e)}")

# ============================================================================
# TEST 2: GET /api/availability?date=<future weekday>&tz=Asia/Kolkata
# ============================================================================
print("TEST 2: GET /api/availability for future weekday with Asia/Kolkata timezone")
print("-" * 80)
future_weekday = get_future_weekday()
print(f"Using future weekday date: {future_weekday}")
try:
    response = requests.get(f"{API_BASE}/availability", params={
        "date": future_weekday,
        "tz": "Asia/Kolkata"
    })
    data = response.json()
    
    test(
        "GET /api/availability returns 200",
        response.status_code == 200,
        f"Status: {response.status_code}"
    )
    
    test(
        "Response is a JSON array",
        isinstance(data, list),
        f"Type: {type(data)}"
    )
    
    test(
        "Array contains slots (non-empty for future weekday)",
        len(data) > 0,
        f"Slot count: {len(data)}"
    )
    
    if len(data) > 0:
        sample_slot = data[0]
        test(
            "Each slot has required keys: label, iso_utc, taken",
            all(key in sample_slot for key in ["label", "iso_utc", "taken"]),
            f"Sample slot keys: {list(sample_slot.keys())}"
        )
        
        test(
            "taken field is boolean",
            isinstance(sample_slot["taken"], bool),
            f"taken type: {type(sample_slot['taken'])}"
        )
        
        # Find 9:00 IST slot and verify UTC conversion
        slot_9am = next((s for s in data if s["label"] == "09:00"), None)
        if slot_9am:
            test(
                "9:00 IST maps to iso_utc ending in 03:30:00Z",
                slot_9am["iso_utc"].endswith("03:30:00Z"),
                f"9:00 IST slot: {slot_9am['iso_utc']}"
            )
        else:
            test(
                "9:00 IST slot exists in response",
                False,
                "9:00 slot not found in response"
            )
        
        print(f"📊 Total slots returned: {len(data)}")
        print(f"📋 Sample slot: {json.dumps(sample_slot, indent=2)}")
        print()
        
except Exception as e:
    test("GET /api/availability for future weekday", False, f"Error: {str(e)}")

# ============================================================================
# TEST 3: GET /api/availability for weekend => empty array
# ============================================================================
print("TEST 3: GET /api/availability for weekend date")
print("-" * 80)
weekend_date = get_weekend_date()
print(f"Using weekend date (Saturday): {weekend_date}")
try:
    response = requests.get(f"{API_BASE}/availability", params={
        "date": weekend_date,
        "tz": "Asia/Kolkata"
    })
    data = response.json()
    
    test(
        "GET /api/availability for weekend returns 200 with empty array",
        response.status_code == 200 and isinstance(data, list) and len(data) == 0,
        f"Status: {response.status_code}, Response: {data}"
    )
except Exception as e:
    test("GET /api/availability for weekend", False, f"Error: {str(e)}")

# ============================================================================
# TEST 4: GET /api/availability with unsupported timezone (Europe/London)
# ============================================================================
print("TEST 4: GET /api/availability with unsupported timezone")
print("-" * 80)
try:
    response = requests.get(f"{API_BASE}/availability", params={
        "date": future_weekday,
        "tz": "Europe/London"
    })
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.json()}")
    test(
        "GET /api/availability with Europe/London returns 400 (unsupported)",
        response.status_code == 400,
        f"Status: {response.status_code}, Response: {response.json()}"
    )
except Exception as e:
    test("GET /api/availability with unsupported timezone", False, f"Error: {str(e)}")

# ============================================================================
# TEST 5: POST /api/booking-requests with valid lead including slot
# ============================================================================
print("TEST 5: POST /api/booking-requests with valid lead including slot_iso_utc and timezone")
print("-" * 80)
try:
    # First get available slots
    response = requests.get(f"{API_BASE}/availability", params={
        "date": future_weekday,
        "tz": "Asia/Kolkata"
    })
    slots = response.json()
    
    if len(slots) > 0:
        # Pick the first available slot
        available_slot = next((s for s in slots if not s["taken"]), slots[0])
        
        booking_payload = {
            "name": "Sarah Chen",
            "company": "Acme Logistics",
            "country": "UAE",
            "industry": "Freight",
            "process": "We manually copy leads from email into a spreadsheet every morning",
            "contact_method": "Email",
            "email": "sarah@acmelogistics.com",
            "slot_iso_utc": available_slot["iso_utc"],
            "timezone": "Asia/Kolkata"
        }
        
        response = requests.post(f"{API_BASE}/booking-requests", json=booking_payload)
        data = response.json()
        
        test(
            "POST /api/booking-requests returns 200",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
        
        test(
            "Response includes id and created_at",
            "id" in data and "created_at" in data,
            f"Response keys: {list(data.keys())}"
        )
        
        test(
            "slot_iso_utc is persisted in response",
            data.get("slot_iso_utc") == available_slot["iso_utc"],
            f"Expected: {available_slot['iso_utc']}, Got: {data.get('slot_iso_utc')}"
        )
        
        test(
            "timezone is persisted in response",
            data.get("timezone") == "Asia/Kolkata",
            f"Expected: Asia/Kolkata, Got: {data.get('timezone')}"
        )
        
        print(f"📋 Created booking: {json.dumps(data, indent=2)}")
        print()
    else:
        test("POST /api/booking-requests", False, "No available slots to test with")
        
except Exception as e:
    test("POST /api/booking-requests", False, f"Error: {str(e)}")

# ============================================================================
# TEST 6: POST /api/audit-requests validation
# ============================================================================
print("TEST 6: POST /api/audit-requests validation")
print("-" * 80)

# Valid payload
try:
    valid_payload = {
        "name": "Priya Sharma",
        "company": "TechFlow Solutions",
        "country": "India",
        "industry": "Technology",
        "process": "Lead qualification and follow-up automation needs improvement",
        "contact_method": "Email",
        "email": "priya@techflow.in"
    }
    
    response = requests.post(f"{API_BASE}/audit-requests", json=valid_payload)
    data = response.json()
    
    test(
        "POST /api/audit-requests with valid payload returns 200",
        response.status_code == 200,
        f"Status: {response.status_code}"
    )
    
    test(
        "Response includes id and created_at",
        "id" in data and "created_at" in data,
        f"Response keys: {list(data.keys())}"
    )
except Exception as e:
    test("POST /api/audit-requests with valid payload", False, f"Error: {str(e)}")

# Empty name validation
try:
    invalid_payload = {
        "name": "",
        "company": "Test Company",
        "country": "UAE",
        "industry": "Tech",
        "process": "Some process description here",
        "contact_method": "Email",
        "email": "test@example.com"
    }
    
    response = requests.post(f"{API_BASE}/audit-requests", json=invalid_payload)
    
    test(
        "POST /api/audit-requests with empty name returns 422",
        response.status_code == 422,
        f"Status: {response.status_code}, Response: {response.json()}"
    )
except Exception as e:
    test("POST /api/audit-requests with empty name", False, f"Error: {str(e)}")

# Empty process validation
try:
    invalid_payload = {
        "name": "Valid Name",
        "company": "Test Company",
        "country": "UAE",
        "industry": "Tech",
        "process": "",
        "contact_method": "Email",
        "email": "test@example.com"
    }
    
    response = requests.post(f"{API_BASE}/audit-requests", json=invalid_payload)
    
    test(
        "POST /api/audit-requests with empty process returns 422",
        response.status_code == 422,
        f"Status: {response.status_code}, Response: {response.json()}"
    )
except Exception as e:
    test("POST /api/audit-requests with empty process", False, f"Error: {str(e)}")

# ============================================================================
# TEST 7: POST /api/playbook-requests
# ============================================================================
print("TEST 7: POST /api/playbook-requests")
print("-" * 80)
try:
    playbook_payload = {
        "name": "Priya Sharma",
        "email": "priya@acmelogistics.com"
    }
    
    response = requests.post(f"{API_BASE}/playbook-requests", json=playbook_payload)
    data = response.json()
    
    test(
        "POST /api/playbook-requests returns 200",
        response.status_code == 200,
        f"Status: {response.status_code}"
    )
    
    test(
        "Response includes id and created_at",
        "id" in data and "created_at" in data,
        f"Response keys: {list(data.keys())}"
    )
    
    print(f"📋 Created playbook request: {json.dumps(data, indent=2)}")
    print()
except Exception as e:
    test("POST /api/playbook-requests", False, f"Error: {str(e)}")

# ============================================================================
# TEST 8: POST /api/calculator-leads
# ============================================================================
print("TEST 8: POST /api/calculator-leads")
print("-" * 80)
try:
    calculator_payload = {
        "name": "Michael Rodriguez",
        "email": "michael@automatenow.com",
        "company": "AutomateNow Consulting",
        "source": "services-page-calculator",
        "inputs_json": json.dumps({"hours_per_week": 20, "hourly_rate": 50}),
        "result_summary": "Potential savings: $52,000/year"
    }
    
    response = requests.post(f"{API_BASE}/calculator-leads", json=calculator_payload)
    data = response.json()
    
    test(
        "POST /api/calculator-leads returns 200",
        response.status_code == 200,
        f"Status: {response.status_code}"
    )
    
    test(
        "Response includes id and created_at",
        "id" in data and "created_at" in data,
        f"Response keys: {list(data.keys())}"
    )
    
    print(f"📋 Created calculator lead: {json.dumps(data, indent=2)}")
    print()
except Exception as e:
    test("POST /api/calculator-leads", False, f"Error: {str(e)}")

# ============================================================================
# TEST 9: POST /api/contact-messages
# ============================================================================
print("TEST 9: POST /api/contact-messages")
print("-" * 80)
try:
    contact_payload = {
        "name": "Jennifer Lee",
        "company": "Global Freight Solutions",
        "country": "Singapore",
        "industry": "Logistics",
        "process": "We need help automating our invoice processing and customer communication workflows",
        "contact_method": "Email",
        "email": "jennifer@globalfreight.sg",
        "source": "contact-page"
    }
    
    response = requests.post(f"{API_BASE}/contact-messages", json=contact_payload)
    data = response.json()
    
    test(
        "POST /api/contact-messages returns 200",
        response.status_code == 200,
        f"Status: {response.status_code}"
    )
    
    test(
        "Response includes id and created_at",
        "id" in data and "created_at" in data,
        f"Response keys: {list(data.keys())}"
    )
    
    print(f"📋 Created contact message: {json.dumps(data, indent=2)}")
    print()
except Exception as e:
    test("POST /api/contact-messages", False, f"Error: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total tests: {total_tests}")
print(f"Passed: {passed_tests}")
print(f"Failed: {len(failed_tests)}")
print()

if failed_tests:
    print("FAILED TESTS:")
    for failure in failed_tests:
        print(f"  ❌ {failure}")
    print()
    exit(1)
else:
    print("✅ ALL TESTS PASSED!")
    exit(0)
