import whois
from datetime import datetime

def get_domain_age(domain: str):

    try:
        info = whois.whois(domain)

        creation_date = info.creation_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]

        if not creation_date:
            return None

        age_days = (datetime.now() - creation_date).days

        return age_days

    except:
        return None