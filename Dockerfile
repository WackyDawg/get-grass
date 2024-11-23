FROM ghcr.io/puppeteer/puppeteer:22.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app



COPY package*.json ./
RUN npm ci
COPY . .

# Ensure the extension directory exists and has the right permissions
RUN mkdir -p /usr/src/app/extensions && \
    chmod -R 777 /usr/src/app/extensions
RUN chown -R node:node /usr/src/app/extensions
USER node

CMD ["node", "multi-browser.js"]
