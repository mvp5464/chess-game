// interface Game {
//   id: number;
//   name: string;
//   player1: WebSocket;
//   player2: WebSocket;
// }

import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCount = 0;

  // Whenever the game is start this will be the state and msgs
  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess(); // anytime the board is created we create a new instance of a chess class
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
  }

  // This function is called whenever someone moves in the game
  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // first validate the move
    // Validate the type of move using zod
    // 1 Is it this users move (by chess.js)
    // 2 Is the move valid (by chess.js)
    console.log(26);
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      console.log("this.board.moves().length % 2");
      console.log(this.moveCount % 2);
      console.log("one");
      return; // If the player1 is tring to move 2 turns it will show an error (chess.js will check this in below move)
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      console.log("this.board.moves().length % 2");
      console.log(this.moveCount % 2);
      console.log("two");
      return; // If the player2 is tring to move 2 turns it will show an error
    }

    try {
      console.log(27);
      this.board.move(move); // If move is valide then change/update the move
      console.log(278);
    } catch (e) {
      console.log(e);
      return;
    }

    // Update the board (by chess.js)
    // Push the move (by chess.js)
    //
    // Check if the game is over
    if (this.board.isGameOver()) {
      // Send the gameover message to both the player
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white", // If after checkmate its white turn then black wins elso white wins
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white", // If after checkmate its white turn then black wins elso white wins
          },
        })
      );
      return;
    }
    // If game is not over then move
    if (this.moveCount % 2 === 0) {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    //
    // Send the update board to both the players
    this.moveCount++;

    // ADDING A TIME LOGIC IS REMAINING ( IF THE TIME IS UP FOR ANY PLAYER THEN THE GAME ENDS )
  }
}
