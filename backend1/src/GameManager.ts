import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

// should have more classes User class, Game Class
export class GameManager {
  private games: Game[]; // This a global array of all the games (all current games are listed here)
  private pendingUser: WebSocket | null; // when user search for opponent
  private users: WebSocket[]; // all the users

  // When starting game this is what given??
  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }
  // When any user connects first it goes here
  addUser(socket: WebSocket) {
    // add a user to an array called users (not needed maybe)
    console.log(2);
    this.users.push(socket);
    // Logic for all actions
    this.addHandler(socket);
  }
  // When user remove then it perform this logic to remove user
  removeUser(socket: WebSocket) {
    // remove a user from this array (IDEALLY SHOULD WAIT FOR USER TO RECONNECT)
    this.users = this.users.filter((user) => user !== socket); //????
  }

  // all the incoming msg from frontend will be handled here (why?? because called above)
  private addHandler(socket: WebSocket) {
    console.log(23);
    //
    socket.on("message", (data) => {
      // when callout something use grpc here
      const message = JSON.parse(data.toString()); // what msg frontend is sending

      // This will gets called whenever the frontend sends "init_game" (to start the game)
      if (message.type === INIT_GAME) {
        // If no one is waiting then this will be added to pendingUser else this user will be connected to the pendingUser
        if (this.pendingUser) {
          // Start a game
          const game = new Game(this.pendingUser, socket); // connect a game between pendingUser and this new User
          this.games.push(game); // Push this game to the games array
          this.pendingUser = null; // Make the pending user empty
        } else {
          // or make a user a pendingUser
          this.pendingUser = socket; // add that user to pendingUser
        }
      }
      // This is called whenever the client/browser/frontend sends "move" (when the user move in the game)
      console.log(24);
      if (message.type === MOVE) {
        // First find their ongoing game here
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        // Make a move and update it (makeMove function)
        if (game) {
          console.log(25);
          game.makeMove(socket, message.payload.move);
        }
      }
    });
  }
}
