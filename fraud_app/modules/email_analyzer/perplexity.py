import math

_model = None
_tokenizer = None


def load_model():

    global _model
    global _tokenizer

    if _model is None or _tokenizer is None:

        import torch

        from transformers import (
            AutoTokenizer,
            AutoModelForCausalLM
        )

        MODEL_NAME = "distilgpt2"

        _tokenizer = AutoTokenizer.from_pretrained(
            MODEL_NAME
        )

        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME
        )

        _model.eval()

    return _model, _tokenizer


def compute_perplexity(text: str) -> float:

    if not text.strip():

        return float("inf")

    model, tokenizer = load_model()

    import torch

    with torch.no_grad():

        enc = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=256
        )

        input_ids = enc["input_ids"]

        outputs = model(
            input_ids,
            labels=input_ids
        )

        loss = float(outputs.loss)

        ppl = (
            math.exp(loss)
            if loss < 50
            else float("inf")
        )

        return round(ppl, 3)