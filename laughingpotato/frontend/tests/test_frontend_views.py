from rest_framework.status import HTTP_200_OK

from laughingpotato.frontend.views import index


def test_frontend(api_rf):
    """
    Test that the frontend is working
    """
    request = api_rf.get("/")
    response = index(request)
    assert response.status_code == HTTP_200_OK
