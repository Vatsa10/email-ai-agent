import json
import yaml
import os
import google.generativeai as genai
from dotenv import load_dotenv
from typing import List

# Load environment variables
load_dotenv()


def load_config():
    with open("config.yaml", "r") as f:
        return yaml.safe_load(f)


def generate_embeddings():
    config = load_config()
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    embedding_model = "models/text-embedding-004"

    # Load the vault content
    print("Loading vault content...")
    with open(config["vault_file"], "r", encoding="utf-8") as f:
        vault_text = f.read().split("\n")

    # Generate embeddings
    print("Generating embeddings... This may take a while.")
    embeddings = []
    for i, text in enumerate(vault_text):
        if text.strip():  # Skip empty lines
            result = genai.embed_content(
                model=embedding_model,
                content=text,
                task_type="retrieval_document"
            )
            embeddings.append(result['embedding'])
            if (i + 1) % 10 == 0:
                print(f"Processed {i + 1} lines...")

    # Save embeddings
    print(f"Saving embeddings to {config['embeddings_file']}...")
    with open(config["embeddings_file"], "w") as f:
        json.dump(embeddings, f)

    print("Done! Embeddings have been generated and saved.")


if __name__ == "__main__":
    generate_embeddings()
