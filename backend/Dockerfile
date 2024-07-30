FROM thehale/python-poetry:1.8.3-py3.10-slim

RUN apt-get update -y
RUN apt-get install gcc -y

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

ENTRYPOINT [ "python", "-m", "app.main" ] 