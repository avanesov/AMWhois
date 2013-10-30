# Barlus :)
# Send Your CV to info@armcoder.am

rtrim = (str, charlist) ->
  charlist = (if not charlist then " \\s " else (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\\$1"))
  re = new RegExp("[" + charlist + "]+$", "g")
  (str + "").replace re, ""

$.getWhoIs = ->
  serviceUrl = "https://www.amnic.net/whois/?domain=" + rtrim($("#input").val(), ".am") + ".am"
  $("#loader").fadeIn()
  $.ajax
    type: "GET"
    url: serviceUrl
    crossDomain: true
    cache: false
    async: false
    success: (data) ->
      html = $(data)
      result = html.filter("ul")
      if result.length < 1
        $("#result").html "<p class='notFound'>Data not received</p>"
      else
        $("#result").html result
      $("#loader").fadeOut()

  $("#input").val null
  $("#refer").show()
  $ ->
    $("body").jScrollPane()


jQuery ($) ->
  $ ->
    $("body").jScrollPane()

  $("#get").click (e) ->
    e.preventDefault()
    $.getWhoIs()

  $("#whoForm").submit (e) ->
    e.preventDefault()
    $.getWhoIs()

