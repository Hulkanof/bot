import WebSocket from "ws"
import readline from "readline-sync"

const port = readline.question("Enter the port to connect to: ")
const ws = new WebSocket(`ws://localhost:${port}`)

ws.on("error", console.error)

ws.on("open", function open() {
	console.log("connected")
})

ws.on("message", function message(data) {
	console.log("received: %s", data)
})

ws.on("close", function close() {
	console.log("disconnected")
})

// prompt for input from the user and send it to the server via the websocket
const stdin = process.openStdin()
stdin.addListener("data", function (d) {
	ws.send(d.toString().trim())
})
