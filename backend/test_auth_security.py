#!/usr/bin/env python3
"""Test authentication security improvements"""

import sys
sys.path.insert(0, '.')

from app.config import SECRET_KEY
from app.schemas import UserCreate, PasswordChange
from pydantic import ValidationError

print("=" * 60)
print("PHASE 1 AUTHENTICATION SECURITY TESTS")
print("=" * 60)

# Test 1: SECRET_KEY Configuration
print("\n1. Testing SECRET_KEY configuration...")
if SECRET_KEY and len(SECRET_KEY) >= 32:
    print(f"✓ SECRET_KEY loaded successfully (length: {len(SECRET_KEY)})")
else:
    print(f"✗ SECRET_KEY missing or too weak (length: {len(SECRET_KEY) if SECRET_KEY else 0})")

# Test 2: Weak password rejection
print("\n2. Testing weak password rejection...")
weak_passwords = [
    "weak",           # Too short
    "weakpassword",   # No uppercase, digit, special
    "Weakpassword",   # No digit, special
    "Weakpass123",    # No special
    "WEAKPASS123!",   # No lowercase
]

for pwd in weak_passwords:
    try:
        UserCreate(name="Test", email="test@test.com", password=pwd)
        print(f"✗ Weak password accepted: '{pwd}' - FAIL")
    except ValidationError as e:
        print(f"✓ Weak password rejected: '{pwd}' - OK")

# Test 3: Strong password acceptance
print("\n3. Testing strong password acceptance...")
strong_passwords = [
    "StrongPass123!",
    "MySecure@Password456",
    "Complex#Pass789",
]

for pwd in strong_passwords:
    try:
        UserCreate(name="Test", email="test@test.com", password=pwd)
        print(f"✓ Strong password accepted: '{pwd}' - OK")
    except ValidationError as e:
        print(f"✗ Strong password rejected: '{pwd}' - FAIL")

# Test 4: PasswordChange validation
print("\n4. Testing PasswordChange validation...")
try:
    PasswordChange(current_password="oldpass", new_password="weak")
    print("✗ Weak password change accepted - FAIL")
except ValidationError:
    print("✓ Weak password change rejected - OK")

try:
    PasswordChange(current_password="oldpass", new_password="StrongPass123!")
    print("✓ Strong password change accepted - OK")
except ValidationError:
    print("✗ Strong password change rejected - FAIL")

print("\n" + "=" * 60)
print("AUTHENTICATION SECURITY TESTS COMPLETE")
print("=" * 60)
