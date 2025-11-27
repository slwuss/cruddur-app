FROM 739623014075.dkr.ecr.ap-southeast-2.amazonaws.com/cruddur-python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# Bootstrap OpenTelemetry instrumentation
RUN opentelemetry-bootstrap -a install


COPY . .

ENV FLASK_DEBUG=1

EXPOSE ${PORT}

CMD ["opentelemetry-instrument", "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567"]
#CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0", "--port=4567" ]