$(function() {//same as document.addEventListener("DOMContentLoaded") ......

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function() {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsible-nav").collapse('hide');
    }
  });

  // // In Firefox and Safari, the click event doesn't retain the focus
  // // on the clicked button. Therefore, the blur event will not fire on
  // // user clicking somewhere else in the page and the blur event handler
  // // which is set up above will not be called.
  // // Refer to issue #28 in the repo.
  // // Solution: force focus on the element that the click event fired on
  // $("#navbarToggle").click(function (event) {
  //   $(event.target).focus();
  // });

});

(function(global) {

  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";

  // Convenience function for inserting innerHTML for 'select'
  var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'
  var showLoading = function(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>"; //see www.ajaxload.info
    insertHtml(selector, html);
  };

  // Return substitute of property '{{propName}}' with propValue in given 'string'
  var insertProperty = function(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }


  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function(event) {

    // On firsr load, show home view
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function(responseText) {
      document.querySelector("#main-content").innerHTML = responseText;
      },
      false);
  });

  // Load menu categories view
  dc.loadMenuCategories = function() {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHtml);
  };

  // Builds HTML for the categories page based on the data from the server
  function buildAndShowCategoriesHtml(categories) {
    // Load title snippet of the categories page
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function(categoriesTitleHtml) {
        // Retrieve single category snippet
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function(categoryHtml) {
            var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }

  // Using categories data & snippets html
  // build the categories view HTML to be inserted into page
  function buildCategoriesViewHtml(categories,
                                  categoriesTitleHtml,
                                  categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    // Now, loop over categories and add to the 'finalHtml' string
    for (var i = 0; i < categories.length; i++) {
      //insert category values
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  global.$dc = dc;

})(window);
