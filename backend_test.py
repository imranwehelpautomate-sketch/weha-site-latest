#!/usr/bin/env python3
"""
Comprehensive backend test for IST-anchored availability (8AM-8PM IST, all 7 days) 
+ 15/30-min duration + overlap blocking
"""

import requests
import json
from datetime import datetime

# Backend URL
BASE_URL = "http://localhost:8001/api"

def test_api_root():
    """Test GET /api/ returns correct message"""
    print("\n=== TEST 1: GET /api/ ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert data.get("message") == "WeHA API", f"Expected 'WeHA API', got {data.get('message')}"
    print("✅ PASS: GET /api/ returns correct message")
    return True

def test_availability_kolkata_15min():
    """Test GET /api/availability with Asia/Kolkata, duration=15"""
    print("\n=== TEST 2: GET /api/availability (Asia/Kolkata, duration=15) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "Asia/Kolkata",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) == 48, f"Expected 48 slots, got {len(data)}"
    
    # Check first slot
    first_slot = data[0]
    print(f"First slot: {first_slot}")
    assert first_slot["label"] == "8:00 AM", f"Expected '8:00 AM', got {first_slot['label']}"
    assert first_slot["iso_utc"] == "2026-07-15T02:30:00Z", f"Expected '2026-07-15T02:30:00Z', got {first_slot['iso_utc']}"
    assert "taken" in first_slot, "Missing 'taken' field"
    assert isinstance(first_slot["taken"], bool), f"'taken' should be bool, got {type(first_slot['taken'])}"
    
    # Check last slot
    last_slot = data[-1]
    print(f"Last slot: {last_slot}")
    assert last_slot["label"] == "7:45 PM", f"Expected '7:45 PM', got {last_slot['label']}"
    assert last_slot["iso_utc"] == "2026-07-15T14:15:00Z", f"Expected '2026-07-15T14:15:00Z', got {last_slot['iso_utc']}"
    
    print("✅ PASS: Asia/Kolkata duration=15 returns 48 slots with correct first/last")
    return True

def test_availability_kolkata_30min():
    """Test GET /api/availability with Asia/Kolkata, duration=30"""
    print("\n=== TEST 3: GET /api/availability (Asia/Kolkata, duration=30) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "Asia/Kolkata",
        "duration": 30
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) == 47, f"Expected 47 slots, got {len(data)}"
    
    # Check last slot
    last_slot = data[-1]
    print(f"Last slot: {last_slot}")
    assert last_slot["label"] == "7:30 PM", f"Expected '7:30 PM', got {last_slot['label']}"
    assert last_slot["iso_utc"] == "2026-07-15T14:00:00Z", f"Expected '2026-07-15T14:00:00Z', got {last_slot['iso_utc']}"
    
    print("✅ PASS: Asia/Kolkata duration=30 returns 47 slots with correct last slot")
    return True

def test_availability_sydney_15min():
    """Test GET /api/availability with Australia/Sydney, duration=15 (DST-correct)"""
    print("\n=== TEST 4: GET /api/availability (Australia/Sydney, duration=15) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "Australia/Sydney",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) == 48, f"Expected 48 slots (DST-correct), got {len(data)}"
    
    # Check structure
    if len(data) > 0:
        print(f"First slot: {data[0]}")
        print(f"Last slot: {data[-1]}")
        assert "label" in data[0], "Missing 'label' field"
        assert "iso_utc" in data[0], "Missing 'iso_utc' field"
        assert "taken" in data[0], "Missing 'taken' field"
    
    print("✅ PASS: Australia/Sydney duration=15 returns 48 slots (DST-correct)")
    return True

def test_availability_los_angeles_15min():
    """Test GET /api/availability with America/Los_Angeles, duration=15 (DST-correct)"""
    print("\n=== TEST 5: GET /api/availability (America/Los_Angeles, duration=15) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "America/Los_Angeles",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) == 48, f"Expected 48 slots (DST-correct), got {len(data)}"
    
    # Check structure
    if len(data) > 0:
        print(f"First slot: {data[0]}")
        print(f"Last slot: {data[-1]}")
    
    print("✅ PASS: America/Los_Angeles duration=15 returns 48 slots (DST-correct)")
    return True

def test_availability_weekend_saturday():
    """Test GET /api/availability for Saturday (weekends now allowed)"""
    print("\n=== TEST 6: GET /api/availability (Saturday 2026-07-18) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-18",  # Saturday
        "tz": "Asia/Kolkata",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) > 0, f"Expected slots on Saturday (weekends allowed), got {len(data)}"
    assert len(data) == 48, f"Expected 48 slots on Saturday, got {len(data)}"
    
    print("✅ PASS: Saturday returns slots (weekends allowed)")
    return True

def test_availability_weekend_sunday():
    """Test GET /api/availability for Sunday (weekends now allowed)"""
    print("\n=== TEST 7: GET /api/availability (Sunday 2026-07-19) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-19",  # Sunday
        "tz": "Asia/Kolkata",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) > 0, f"Expected slots on Sunday (weekends allowed), got {len(data)}"
    assert len(data) == 48, f"Expected 48 slots on Sunday, got {len(data)}"
    
    print("✅ PASS: Sunday returns slots (weekends allowed)")
    return True

def test_availability_unsupported_timezone():
    """Test GET /api/availability with unsupported timezone (Europe/London)"""
    print("\n=== TEST 8: GET /api/availability (unsupported tz Europe/London) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "Europe/London",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    data = response.json()
    print(f"Error response: {data}")
    assert "detail" in data, "Expected 'detail' in error response"
    
    print("✅ PASS: Unsupported timezone returns 400")
    return True

def test_availability_bad_date():
    """Test GET /api/availability with bad date format"""
    print("\n=== TEST 9: GET /api/availability (bad date 'abc') ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "abc",
        "tz": "Asia/Kolkata",
        "duration": 15
    })
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    data = response.json()
    print(f"Error response: {data}")
    
    print("✅ PASS: Bad date format returns 400")
    return True

def test_availability_invalid_duration():
    """Test GET /api/availability with invalid duration (45) - should default to 15"""
    print("\n=== TEST 10: GET /api/availability (invalid duration=45, should default to 15) ===")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-15",
        "tz": "Asia/Kolkata",
        "duration": 45
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Number of slots: {len(data)}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    assert len(data) == 48, f"Expected 48 slots (defaulted to 15min), got {len(data)}"
    
    print("✅ PASS: Invalid duration=45 defaults to 15, returns 48 slots")
    return True

def test_booking_overlap_blocking():
    """Test overlap/blocking: POST booking, verify slot taken, test overlap prevention"""
    print("\n=== TEST 11: Overlap/Blocking - POST booking and verify taken status ===")
    
    # First, create a booking for 2026-07-20 at 9:00 AM IST (03:30 UTC)
    booking_payload = {
        "name": "Grace Hopper",
        "company": "Navy Systems",
        "process": "We manually re-key purchase orders from email into our ERP every afternoon.",
        "contact_method": "Email",
        "email": "grace@navysys.com",
        "slot_iso_utc": "2026-07-20T03:30:00Z",
        "timezone": "Asia/Kolkata",
        "duration_minutes": 15
    }
    
    print(f"Creating booking: {booking_payload['name']} at {booking_payload['slot_iso_utc']}")
    response = requests.post(f"{BASE_URL}/booking-requests", json=booking_payload)
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"Booking created: {data.get('id')}")
    assert data.get("duration_minutes") == 15, f"Expected duration_minutes=15, got {data.get('duration_minutes')}"
    
    # Now check availability for 2026-07-20 with duration=15
    print("\n--- Checking availability for 2026-07-20 (duration=15) ---")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-20",
        "tz": "Asia/Kolkata",
        "duration": 15
    })
    data = response.json()
    
    # Find the 9:00 AM slot
    slot_9am = next((s for s in data if s["iso_utc"] == "2026-07-20T03:30:00Z"), None)
    slot_845am = next((s for s in data if s["label"] == "8:45 AM"), None)
    slot_915am = next((s for s in data if s["label"] == "9:15 AM"), None)
    
    print(f"9:00 AM slot: {slot_9am}")
    print(f"8:45 AM slot: {slot_845am}")
    print(f"9:15 AM slot: {slot_915am}")
    
    assert slot_9am is not None, "9:00 AM slot not found"
    assert slot_9am["taken"] == True, f"Expected 9:00 AM slot to be taken, got {slot_9am['taken']}"
    assert slot_845am["taken"] == False, f"Expected 8:45 AM slot to be available, got {slot_845am['taken']}"
    assert slot_915am["taken"] == False, f"Expected 9:15 AM slot to be available, got {slot_915am['taken']}"
    
    print("✅ PASS: 9:00 AM slot is taken, adjacent 15-min slots are available")
    
    # Now check availability with duration=30
    print("\n--- Checking availability for 2026-07-20 (duration=30) ---")
    response = requests.get(f"{BASE_URL}/availability", params={
        "date": "2026-07-20",
        "tz": "Asia/Kolkata",
        "duration": 30
    })
    data = response.json()
    
    # Find relevant slots
    slot_830am = next((s for s in data if s["label"] == "8:30 AM"), None)
    slot_845am_30 = next((s for s in data if s["label"] == "8:45 AM"), None)
    slot_9am_30 = next((s for s in data if s["label"] == "9:00 AM"), None)
    slot_930am = next((s for s in data if s["label"] == "9:30 AM"), None)
    
    print(f"8:30 AM slot (30min): {slot_830am}")
    print(f"8:45 AM slot (30min): {slot_845am_30}")
    print(f"9:00 AM slot (30min): {slot_9am_30}")
    print(f"9:30 AM slot (30min): {slot_930am}")
    
    assert slot_830am["taken"] == False, f"Expected 8:30 AM (30min) to be available, got {slot_830am['taken']}"
    assert slot_845am_30["taken"] == True, f"Expected 8:45 AM (30min) to be taken (overlaps), got {slot_845am_30['taken']}"
    assert slot_9am_30["taken"] == True, f"Expected 9:00 AM (30min) to be taken (overlaps), got {slot_9am_30['taken']}"
    assert slot_930am["taken"] == False, f"Expected 9:30 AM (30min) to be available, got {slot_930am['taken']}"
    
    print("✅ PASS: 30-min slots show correct overlap blocking")
    return True

def test_booking_double_booking_prevention():
    """Test double-booking prevention: POST overlapping booking should return 409"""
    print("\n=== TEST 12: Double-booking prevention (409) ===")
    
    # Try to book an overlapping slot (8:45 AM IST for 30 minutes, which overlaps with existing 9:00 AM 15-min booking)
    overlapping_payload = {
        "name": "Ada Lovelace",
        "company": "Analytical Engines",
        "process": "We reconcile invoices across two systems by hand each day.",
        "contact_method": "Email",
        "email": "ada@engines.co",
        "slot_iso_utc": "2026-07-20T03:15:00Z",  # 8:45 AM IST
        "timezone": "Asia/Kolkata",
        "duration_minutes": 30
    }
    
    print(f"Attempting overlapping booking: {overlapping_payload['name']} at {overlapping_payload['slot_iso_utc']}")
    response = requests.post(f"{BASE_URL}/booking-requests", json=overlapping_payload)
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 409, f"Expected 409 (conflict), got {response.status_code}"
    data = response.json()
    print(f"Error response: {data}")
    
    print("✅ PASS: Overlapping booking returns 409")
    return True

def test_booking_backwards_compatible():
    """Test backwards compatibility: POST booking without slot_iso_utc should work"""
    print("\n=== TEST 13: Backwards compatibility (booking without slot) ===")
    
    payload = {
        "name": "Alan Turing",
        "company": "Bletchley Park",
        "process": "We manually decode messages and file them in cabinets.",
        "contact_method": "Email",
        "email": "alan@bletchley.uk"
    }
    
    print(f"Creating booking without slot: {payload['name']}")
    response = requests.post(f"{BASE_URL}/booking-requests", json=payload)
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"Booking created: {data.get('id')}")
    
    print("✅ PASS: Booking without slot_iso_utc works (backwards compatible)")
    return True

def test_regression_audit_requests():
    """Test regression: POST /api/audit-requests"""
    print("\n=== TEST 14: Regression - POST /api/audit-requests ===")
    
    # Valid audit request
    payload = {
        "name": "Margaret Hamilton",
        "company": "MIT Instrumentation Lab",
        "country": "USA",
        "industry": "Aerospace",
        "process": "We manually check flight software calculations with pencil and paper.",
        "contact_method": "Email",
        "email": "margaret@mit.edu"
    }
    
    print("Creating valid audit request")
    response = requests.post(f"{BASE_URL}/audit-requests", json=payload)
    print(f"Status: {response.status_code}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("✅ Valid audit request: PASS")
    
    # Empty name should return 422
    print("\nTesting empty name validation")
    invalid_payload = payload.copy()
    invalid_payload["name"] = ""
    response = requests.post(f"{BASE_URL}/audit-requests", json=invalid_payload)
    print(f"Status: {response.status_code}")
    assert response.status_code == 422, f"Expected 422 for empty name, got {response.status_code}"
    print("✅ Empty name validation: PASS")
    
    # Empty process should return 422
    print("\nTesting empty process validation")
    invalid_payload = payload.copy()
    invalid_payload["process"] = ""
    response = requests.post(f"{BASE_URL}/audit-requests", json=invalid_payload)
    print(f"Status: {response.status_code}")
    assert response.status_code == 422, f"Expected 422 for empty process, got {response.status_code}"
    print("✅ Empty process validation: PASS")
    
    return True

def test_regression_playbook_requests():
    """Test regression: POST /api/playbook-requests"""
    print("\n=== TEST 15: Regression - POST /api/playbook-requests ===")
    
    payload = {
        "name": "Katherine Johnson",
        "company": "NASA",
        "email": "katherine@nasa.gov"
    }
    
    print("Creating playbook request")
    response = requests.post(f"{BASE_URL}/playbook-requests", json=payload)
    print(f"Status: {response.status_code}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print(f"Playbook request created: {data.get('id')}")
    
    print("✅ PASS: POST /api/playbook-requests works")
    return True

def main():
    """Run all tests"""
    print("=" * 80)
    print("COMPREHENSIVE BACKEND TEST: IST-anchored availability + overlap blocking")
    print("=" * 80)
    
    tests = [
        test_api_root,
        test_availability_kolkata_15min,
        test_availability_kolkata_30min,
        test_availability_sydney_15min,
        test_availability_los_angeles_15min,
        test_availability_weekend_saturday,
        test_availability_weekend_sunday,
        test_availability_unsupported_timezone,
        test_availability_bad_date,
        test_availability_invalid_duration,
        test_booking_overlap_blocking,
        test_booking_double_booking_prevention,
        test_booking_backwards_compatible,
        test_regression_audit_requests,
        test_regression_playbook_requests,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"❌ FAIL: {e}")
            failed += 1
        except Exception as e:
            print(f"❌ ERROR: {e}")
            failed += 1
    
    print("\n" + "=" * 80)
    print(f"RESULTS: {passed} passed, {failed} failed out of {len(tests)} tests")
    print("=" * 80)
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
