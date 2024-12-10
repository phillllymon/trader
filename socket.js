const socket = new WebSocket(`wss://stream.data.alpaca.markets/v2/sip`);


socket.onopen = () => {
    console.log("open");
    socket.send(JSON.stringify({"action": "auth", "key": "***", "secret": "***"}));
};

socket.onmessage = (e) => {
    console.log("message for you sir");
    console.log(e.data);
};
setTimeout(() => {
    socket.send(JSON.stringify({"action": "subscribe", "quotes": ["F"]}));
}, 10000);
