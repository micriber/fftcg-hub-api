FROM node:12.18-stretch

WORKDIR /var/www

COPY docker/node/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]

CMD ["npm", "run", "start"]
