import os
import requests
from functools import wraps
from flask import request, jsonify
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError


COGNITO_REGION = os.getenv("COGNITO_REGION")
COGNITO_USER_POOL_ID = os.getenv("COGNITO_USER_POOL_ID")
COGNITO_CLIENT_ID = os.getenv("COGNITO_CLIENT_ID")

JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}/.well-known/jwks.json"
ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"




jwks = requests.get(JWKS_URL).json()

def get_jwk(kid):
    global jwks
    key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    if not key:
        jwks = requests.get(JWKS_URL).json()
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
    return key


def verify_jwt_token(token):
    try:
        header = jwt.get_unverified_header(token)
        kid = header["kid"]

        key = get_jwk(kid)
        if not key:
            raise Exception("Public key not found in JWKS")


        claims = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=COGNITO_CLIENT_ID,
            issuer=ISSUER
        )
        return claims
    except ExpiredSignatureError:
        print("Token expired")
        return None
    except JWTError as e:
        print("JWT Error:", e)
        return None
    except Exception as e:
        print("Token verification failed:", e)
        return None


def jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"error": "Invalid Authorization header format"}), 401

        token = parts[1]
        claims = verify_jwt_token(token)
        if not claims:
            return jsonify({"error": "Invalid or expired token"}), 403

        request.user = claims
        return func(*args, **kwargs)
    return wrapper