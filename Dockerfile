FROM node:latest

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build &&\
    chmod +x run.sh


EXPOSE 3000

CMD [ "./run.sh" ]
