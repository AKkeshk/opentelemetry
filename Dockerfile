FROM node:lts-alpine3.21
WORKDIR /app

COPY . /app/
RUN yarn install --frozen-lockfile
# RUN  yarn start:dev
EXPOSE 3000
CMD ["yarn", "start:dev"]