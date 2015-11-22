$(document).ready(function() {
  // Bind action to buttons
  $("#search-er-button").click(function() {
    var location = $("#search-er-input").val();
    window.location.href = "#/search?location=" + location;
  });
});
