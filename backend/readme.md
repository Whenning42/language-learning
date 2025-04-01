To get started run:

```
cd backend
poetry install
$(poetry env activate)
PYTHONPATH=$(pwd)/src fastapi dev src/app/main.py
```

You might also need to install hunspell and hunspell dictionaries for target languages.
