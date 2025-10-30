import chromadb
import os

CHROMA_URL = os.getenv("CHROMA_URL", "http://chroma:8000")

client = chromadb.HttpClient(host=CHROMA_URL.split("//")[1].split(":")[0], port=8000)
