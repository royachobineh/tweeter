/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */



$(function () {

  //Escape method to avoid XSS attacks
  const escape = function (str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  
  //function to open/close the text area
  const openTextArea = function (boolForScroll=false) {
    if ($('.new-tweet').is(':hidden') || boolForScroll) {
      $('.new-tweet').slideDown('slow', () => {
        $('#tweet-text').focus();
      });
    } else {
      $('.new-tweet').slideUp('slow');
    }
  }

  /*if the user scrolls to/away from the top of the 
  page show/hide the return-to-home button */
  $(window).on('scroll', function () {
    if ($(this).scrollTop()) {
      $('#return-to-home').fadeIn();
    } else {
      $('#return-to-home').fadeOut();
    }
  })

  
  //return to home on click method
  $('#return-to-home').on('click', function () {
    $("html, body").animate({ scrollTop: 0 }, 500, function () { });
    openTextArea(true);
  })

  //write new text on click 
  $('#writeNewText').on('click', function (event) {
    openTextArea();
  })

  //function to create tweet elements
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

  //goes through tweets array and dynamically generates html
  const renderTweets = function (tweets) {
    $('#tweets').empty();

    for (let tweet of tweets) {
      const newTweet = createTweetElement(tweet);

      $('#tweets').prepend(newTweet);
    }
  }

  
  //tweet creation method
  $('#new-tweet-form').on('submit', function (event) {
    event.preventDefault();

    const $tweetText = $(this).children('#tweet-text');

    if ($tweetText.val().length > 140) {
      $('.error').html(`<p>Please respect the 140 character limit</p>`);
      $('.error').slideDown('slow');
      return;
    } else if ($tweetText.val().length === 0) {
      $('.error').html(`<p>Please have something to tweet :D</p>`);
      $('.error').slideDown('slow');
      return
    }

    const formContent = $(this).serialize();

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: formContent
    })
      .done(() => loadTweets())
      .fail(() => console.log("Something went wrong"))
      .always(() => console.log("SUCCESS BAYBEE"));

    $("#tweet-text").val("");
    $(this).find('.counter').val('140');

  });

  loadTweets();
})