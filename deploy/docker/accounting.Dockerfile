FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for Postgres
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files (optional for dev, but good practice)
# RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "ipacx_erp.wsgi:application", "--bind", "0.0.0.0:8000"]
