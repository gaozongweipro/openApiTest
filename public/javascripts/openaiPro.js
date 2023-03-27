const http = require('http');
const markdownIt = require('markdown-it');
md = new markdownIt();
// import { http } from 'http';
const apiKey = "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"; // Replace with your actual API key
let prompt = '';
const options = {
  hostname: 'api.openai.com',
  path: '/v1/engines/text-davinci-003/completions',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + apiKey,
    'Access-Control-Allow-Origin': '*'
  }
};
let model = "text-davinci-003";
const url = "https://api.openai.com/v1/engines/" + model + "/completions";
const imgUrl = "https://api.openai.com/v1"

async function longPoll() {
  try{
    const response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 10,
      })
    })
    const data = await response.text();
    // console.log(data);
    console.log('Received new data:', JSON.parse(data).choices[0].text);
    longPoll();
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      longPoll();
    }, 5000)
  }
}

// 逐字打印效果以及最后的md效果渲染
function printSlowly(text, board) {
  let textList = text.split('');
  let index = 0;
  $(board).find('#lightBlock').removeClass('move');
  const print = setInterval(() => {
    if (index === textList.length - 1) {
      clearInterval(print);
      $(board).find('#lightBlock').remove();
      $(board).find('.wait').html(md.render(text));

      // $(board).find('.wait').html(md.rander()($(board).find('.wait').html()));
      $(board).find('.wait').removeClass('wait');
    }
    $(board).find('.wait #lightBlock').before(textList[index]);
    index++;
  },80)
}

// 调用openAI接口，获取结果
async function openAiApi(data) {
  await fetch(url, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify(data)
  }).then(response => response.json()).then(data => {
    console.log(data);
    let answer = ``;
    data.choices.forEach(item => {
      answer += item.text
    })
    // $('#answer').find('.wait #lightBlock').before($(marked(answer)));

    printSlowly(answer, $('#answer'));
    // $('#answer').html(md.render(answer));

  })
  .catch(error => {
    console.log(error);
  });
}

// 获取输入参数并渲染开始回答的样式
// function startAnswer() {
//   prompt = $('#textInput').val();
//   $('#answer').append(`<div class="question">${prompt}</div>`)
//   $('#answer').append(`<div class="answer wait"><div id="lightBlock" class="move">光标</div></div>`)
//   const params = {
//     "prompt": prompt,
//     "max_tokens": 200,
//     "n": 3,
//   };
//   openAiApi(params);
//   $('#textInput').val('');
// }

// 点击提交按钮
$('#submitMsg').on('click', function() {
  startAnswer();
})

// 点击提交按钮
$('#imgSubmit').on('click', function() {
  startAnswer('IMG');
})

// 输入框回车
$('#textInput').on('keypress', function(even) {
  if (even.keyCode == 13) {
    startAnswer();
  }
})
// 调用openAI图片接口，获取结果
async function openAiImgApi(data) {
  await fetch(imgUrl, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify(data)
  }).then(response => response.json()).then(data => {
    console.log(data);
    let imgUrl = data.data[0].url;
    $('#answer').append(`<img src="${imgUrl}" alt="openai-image">`);
  })
  .catch(error => {
    console.log(error);
  });
}

// 获取输入参数并渲染开始回答的样式
function startAnswer(type) {
  prompt = $('#textInput').val();
  $('#answer').append(`<div class="question">${prompt}</div>`)
  $('#answer').append(`<div class="answer wait"><div id="lightBlock" class="move">光标</div></div>`)
  const params = {
    "prompt": prompt,
    "max_tokens": 200,
    "n": 3,
  };
  if(type === 'IMG') {
    openAiImgApi(params); // 调用openAI图片接口
  } else {
    openAiApi(params);
  }
  $('#textInput').val('');
}





