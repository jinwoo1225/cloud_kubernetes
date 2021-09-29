FROM node:16
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]

# docker deployment to a AWS server can be really easy?
# kubernetes-cluster continous integration/deployment non-stop deployment AWS?
# good first issue? -> I don't know how to attract a newbie?