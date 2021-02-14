# Twitter bot using [Autohook](https://github.com/twitterdev/autohook)

## Env variables

Useful when you're deploying to remote servers, and can be used in conjunction with your dotenv file.

```bash

# To your current environment
export TWITTER_CONSUMER_KEY= # https://developer.twitter.com/en/apps ➡️ Your app ID ➡️ Details ➡️ API key
export TWITTER_CONSUMER_SECRET= # https://developer.twitter.com/en/apps ➡️ Your app ID ➡️ Details ➡️ API secret key
export TWITTER_ACCESS_TOKEN= # https://developer.twitter.com/en/apps ➡️ Your app ID ➡️ Details ➡️ Access token
export TWITTER_ACCESS_TOKEN_SECRET= # https://developer.twitter.com/en/apps ➡️ Your app ID ➡️ Details ➡️ Access token secret
export TWITTER_WEBHOOK_ENV= # https://developer.twitter.com/en/account/environments ➡️ One of 'Dev environment label' or 'Prod environment label'

# To other services, e.g. Heroku
heroku config:set TWITTER_CONSUMER_KEY=value TWITTER_CONSUMER_SECRET=value TWITTER_ACCESS_TOKEN=value TWITTER_ACCESS_TOKEN_SECRET=value TWITTER_WEBHOOK_ENV=value
```


## Install

```bash
# npm
$ npm i -g twitter-autohook

# Yarn
$ yarn global add twitter-autohook
```

## Run locally
> * Set the environment variables
> * Run the commands above to install the packages
```bash
#npm
$ npm start
```
