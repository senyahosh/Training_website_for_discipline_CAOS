FROM gcc:latest

WORKDIR /usr/src/app

COPY . .

ARG C_FILE
RUN gcc -o main $C_FILE 

CMD ["./main"]