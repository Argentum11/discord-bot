# Discord bot

A Discord bot written in Typescript

## How to use

### Prerequisites

- **Bot Token**
  - A bot token is required for the bot to log in to Discord and interact with the Discord API. You can obtain this from the [Discord Developer Portal](https://discord.com/developers/applications).

### Run the Bot Application

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Set Up Environment Variables**

    Make a copy of the `.env.template` file and rename it to `.env`. Then, fill in the required tokens:

    ```bash
    cp .env.template .env
    ```

    Open the `.env` file and fill in your tokens and other necessary configurations.

3. **Launch the Bot**

    ```bash
    npm start
    ```

## Fundamental Concepts

### Partials

Partials in Discord.js represent pieces of data that may be incomplete or "partial" when received from Discord's API. They are used to handle situations where Discord doesn't send complete objects in certain events to save bandwidth and improve performance.

## use case

- Receiving events for uncached messages (e.g., reactions on old messages)
- Handling DM (Direct Message) events
- Working with threads or thread members that aren't fully cached
- Dealing with guild members or users that aren't fully cached

## References

[Intent description](https://ithelp.ithome.com.tw/articles/10318888)
