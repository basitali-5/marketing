# Backend API

This Django backend provides the content automation API used by the frontend dashboard.

## Structure

- `config/`: Django project configuration.
- `jobs/`: job model, serializers, views, and services integration with n8n.
- `manage.py`: Django management entry point.

## Typical setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
