const apiKey = "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"; // Replace with your actual API key
let model = "text-davinci-003";
// model = 'gpt-3.5-turbo'
const maxTokens = 5;

const url = "https://api.openai.com/v1/engines/" + model + "/completions";
let prompt = '';

function printSlowly(text, board) {
  let textList = text.split('');
  let index = 0;
  const print = setInterval(() => {
    if (index === textList.length - 1) {
      clearInterval(print);
    }
    $(board).append(textList[index]);
    index++;
  },100)
}

async function openAiApi(data) {
  await fetch(url, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
      "Model": 'davinci'
    },
    body: JSON.stringify(data)
  }).then(response => response.json()).then(data => {
    console.log(data);
    let answer = ``;
    data.choices.forEach(item => {
      answer += item.text
    })
    $('#answer').css("padding", "20px 15px");
    printSlowly(answer, $('#answer'));
    // $('#answer').html(answer);

  })
  .catch(error => {
    console.log(error);
  });
}

$('#submitMsg').on('click', function() {
  $('#answer').html('');
  console.log($('#textInput').val())
  prompt = $('#textInput').val();
  const params = {
    "prompt": prompt,
    "max_tokens": 1000,
    "n": 1,
  };
  openAiApi(params);
  // fetch(url, {
  //   method: 'post',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": "Bearer " + apiKey,
  //     "Model": 'davinci'
  //   },
  //   body: JSON.stringify(params)
  // }).then(response => response.json()).then(data => {
  //   console.log(data);
  //   let answer = ``;
  //   data.choices.forEach(item => {
  //     answer += item.text
  //   })
  //   $('#answer').css("padding", "20px 15px");
  //   printSlowly(answer, $('#answer'));
  //   // $('#answer').html(answer);
  
  // })
  // .catch(error => {
  //   console.log(error);
  // });
})


