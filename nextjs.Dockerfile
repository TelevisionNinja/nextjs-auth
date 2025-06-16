FROM node:latest

RUN apt update
RUN apt upgrade -y
RUN apt install sqlite3

WORKDIR /test_site/
COPY ./ ./
RUN npm install

# RUN npx --yes create-next-app@latest nextjs-auth --js --yes

EXPOSE 3000

CMD ["npm", "run", "dev"]
