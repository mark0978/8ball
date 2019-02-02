const eightBallAnswers = [
  "It is certain.",
  "Very doubtful.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good."
];

function randomAnswer() {
  return eightBallAnswers[Math.floor(eightBallAnswers.length * Math.random())];
}
function queryAPI() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      console.log("Resolving promise now");
      resolve({ data: randomAnswer() });
    }, 500);
  });
}

export default queryAPI;
