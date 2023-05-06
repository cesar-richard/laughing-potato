import pytest
import responses
from django.conf import settings
from rest_framework.exceptions import NotAuthenticated
from rest_framework.status import HTTP_200_OK
from rest_framework.test import APIRequestFactory


@pytest.fixture(scope="session")
def api_rf():
    """
    APIRequestFactory instance, with a `get` method that uses `rest_framework.test.APIRequestFactory`.
    """
    return APIRequestFactory()


@pytest.fixture(scope="session")
def _request_mock(_request_mock_portail_auth):
    """
    Mock the requests to the API
    """

    class RequestsMock(responses.RequestsMock):
        @property
        def calls(self):
            return [
                c
                for c in self._calls
                if c.request.url != _request_mock_portail_auth.url
            ]

    return RequestsMock()


@pytest.fixture(scope="session")
def _request_mock_portail_auth():
    """
    Mock the requests to the Portail API
    """
    response = responses.Response(
        "POST",
        settings.OAUTH_SETTINGS["token_url"],
        body='{"access_token": "foobar"}',
    )
    response.call_count += 1
    return response


@pytest.fixture
def request_mock(
        _request_mock, _request_mock_portail_auth, status=HTTP_200_OK, **kwargs
):
    """
    Mock the requests to the API
    """
    _request_mock.add(_request_mock_portail_auth, **kwargs)
    _request_mock.status = status
    with _request_mock as rsps:
        yield rsps


def assert_not_authenticated(request_mock, request, called_url, view):
    request.session = {}
    with pytest.raises(NotAuthenticated) as e:
        view(request)
    assert e.type == NotAuthenticated
    request_mock.remove(request.method, called_url)
