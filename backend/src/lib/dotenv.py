import os


def load_dotenv(path):
    if not os.path.exists(path):
        raise ValueError("Couldn't find dotenv file:", path)

    with open(path, "r") as f:
        content = f.readlines()
        for l in content:
            var, val = l.split("=")
            os.environ[var] = val.strip()
