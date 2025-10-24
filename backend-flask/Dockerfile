FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# Bootstrap OpenTelemetry instrumentation
RUN opentelemetry-bootstrap -a install


COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}

CMD ["opentelemetry-instrument", "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]
#CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567" ]