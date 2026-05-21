from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="ealvaradob/bert-finetuned-phishing"
)

def predict_phishing(text: str):

    result = classifier(text)[0]

    return {
        "label": result["label"],
        "score": round(result["score"] * 100, 2)
    }