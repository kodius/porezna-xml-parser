FROM ruby:2.7.1

RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends  && apt-get install npm  -yqq && npm install -g yarn

RUN gem install bundler -v 2.1.4
RUN mkdir /app
WORKDIR /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle config --global frozen 1 && bundle install
COPY . /app
RUN ./bin/webpack && yarn install &&  bundle exec rails webpacker:compile && bundle exec rake assets:precompile

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
