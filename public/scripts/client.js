/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Fake data taken from initial-tweets.json
const data = [
  {
    
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
]
$(function () {
  
  //Escape method to avoid XSS attacks
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }


  const createTweetElement = function (tweet) {
    let tweetHTML = `
      <article class="tweets">
          <header class="tweet-container">
            <div class="tweet-header">
              <img src="${tweet.user.avatars}" />
              <p>${tweet.user.name}</p>
            </div>
            <p class="user-tag">${tweet.user.handle}</p>
          </header>
          <div class="tweet-container">
            <p class="content">${escape(tweet.content.text)}</p>
          </div>
          <footer class="tweet-container">
            <p>${moment(tweet.created_at).fromNow()}</p>
            <div>
              <i class="far fa-flag" id="flag"></i>
              <i class="far fa-heart" id="heart"></i>
              <i class="fas fa-retweet" id="retweet"></i>
            </div>
          </footer>
        </article>
      `;
      return tweetHTML;
  }

  const loadTweets = function () {
    $.ajax({
      url: '/tweets',
      method: 'GET'
    })
      .done((tweets) => {
        renderTweets(tweets)
      })
      .fail(() => console.log('An error has occurred'))
      .always(() => console.log('Succesful request'));
  }

  const renderTweets = function (tweets) {
    $('#tweets').empty();

    for (let tweet of tweets) {
      const newTweet = createTweetElement(tweet);

      $('#tweets').prepend(newTweet);
    }
  }

  $('#new-tweet-form').on('submit', function (event) {
    event.preventDefault();

    const $tweetText = $(this).children('#tweet-text');

    if ($tweetText.val().length > 140) {
      $('.error').html(`<p>Please respect the 140 character limit</p>`);
      $('.error').slideDown('slow');
      return;
    } else if ($tweetText.val().length === 0) {
      $('.error').html(`<p>Please write something!</p>`);
      $('.error').slideDown('slow');
      return;
    }
    const formContent = $(this).serialize();

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formContent
    })
    .done(() => loadTweets())
    .fail(() => console.log("Something went wrong!"))
    .always(() => console.log("Successfull"));

    $("#tweet-text").val("");
    $(this).find('counter').val('140');
  });

  loadTweets();
})

