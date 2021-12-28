# Card Deck app

## To run:
  - In project directory run docker-compose up -d
  - Run docker exec -it carddeck_app_1 npm run migrate
  - API is served at localhost port 3000
  
## Endpoints:
  - POST /deck { type, shuffled } - creates a new deck
  - GET /deck/open/:deckId - opens deck
  - GET /card/draw/:deckId/?count - draws specified number of cards