import requests

def resolve_redirects(url: str):

    try:
        response = requests.get(
            url,
            timeout=5,
            allow_redirects=True
        )

        final_url = response.url

        redirect_count = len(response.history)

        return {
            "final_url": final_url,
            "redirect_count": redirect_count
        }

    except:
        return {
            "final_url": url,
            "redirect_count": 0
        }