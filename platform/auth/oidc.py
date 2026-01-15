import os
import logging

logger = logging.getLogger(__name__)

class KeycloakHandler:
    """
    Helper to interact with Keycloak Admin API and verify tokens.
    """
    def __init__(self):
        self.server_url = os.environ.get("KEYCLOAK_SERVER_URL", "http://localhost:8080")
        self.realm = os.environ.get("KEYCLOAK_REALM", "ipacx")
        self.client_id = os.environ.get("KEYCLOAK_CLIENT_ID", "ipacx-backend")
        self.client_secret = os.environ.get("KEYCLOAK_CLIENT_SECRET", "")
        self.enabled = bool(os.environ.get("KEYCLOAK_ENABLED", False))

    def verify_token(self, token: str):
        if not self.enabled:
            # Dev mode: assume valid or handle via standard Django session
            logger.warning("Keycloak disabled: Skipping token verification")
            return {"active": True, "sub": "dev-user", "tenant_id": "public"}
        
        # Real impl would rely on python-keycloak
        # from keycloak import KeycloakOpenID
        return {"active": True}

    def get_public_key(self):
        # Fetch RS256 public key from OIDC certs endpoint
        pass
