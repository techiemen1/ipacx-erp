import requests
import logging

logger = logging.getLogger(__name__)

class MapsService:
    """
    Wrapper for OpenStreetMap / Nominatim.
    Always respects usages policies (User-Agent).
    """
    BASE_URL = "https://nominatim.openstreetmap.org"

    def reverse_geocode(self, lat: float, lon: float):
        """
        Convert coordinates to address.
        """
        headers = {
            "User-Agent": "IPACX-ERP/1.0 (internal-dev-project)"
        }
        params = {
            "lat": lat,
            "lon": lon,
            "format": "json"
        }
        try:
            resp = requests.get(f"{self.BASE_URL}/reverse", params=params, headers=headers)
            resp.raise_for_status()
            return resp.json().get("display_name")
        except Exception as e:
            logger.error(f"Geocoding failed: {e}")
            return None

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        # Haversine implementation could go here for geofencing checks
        pass
