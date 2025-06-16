FROM nginx:latest

COPY ./nginx.conf /etc/nginx/nginx.conf

WORKDIR /etc/nginx/ssl/
COPY ./nextjsauth.key ./nextjsauth.key
COPY ./nextjsauth.crt ./nextjsauth.crt

EXPOSE 80
EXPOSE 443
