FROM ghcr.io/puppeteer/puppeteer:22.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Switch to root to modify permissions
USER root

# Ensure the extension directory exists and has the right permissions
RUN mkdir -p /usr/src/app/extensions && \
    chmod -R 777 /usr/src/app/extensions

# Switch back to the node user after setting permissions
USER node

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["node", "multi-browser.js"]
