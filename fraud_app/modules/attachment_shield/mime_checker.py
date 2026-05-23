import mimetypes


def detect_mime_type(filename: str):

    mime_type, _ = mimetypes.guess_type(filename)

    return mime_type