FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc g++ libffi-dev && rm -rf /var/lib/apt/lists/*

COPY requirement.txt . 
RUN pip install --no-cache-dir -r requirement.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]