# Barlus :)
# Send Your CV to info@armcoder.am


tpl1 = '<div class="panel panel-default whoisPanel active">
                    <div class="panel-heading">
                        <h4 class="panel-title">
                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}"  id="collapseLink{{indexLink}}">
                                {{domain}}

                            </a>
                        </h4>
                    </div>
                    <div id="collapse{{id}}" class="panel-collapse collapse">
                        <div class="panel-body">
                            {{info}}
                        </div>
                    </div>
        </div>'

rtrim = (str, charlist) ->
  charlist = (if not charlist then " \\s " else (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\\$1"))
  re = new RegExp("[" + charlist + "]+$", "g")
  (str + "").replace re, ""

$.getWhoIs = ->
  domain = rtrim($("#input").val(), ".am") + ".am"
  serviceUrl = "https://www.amnic.net/whois/?domain=" + domain
  $("#loader").fadeIn()
  $("#alert").hide(0)
  $("#tabWrapper").css('margin-top','120px')
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
        $("#alert").show(0)
        $("#tabWrapper").css('margin-top','160px')
      else
        index = Math.floor(Math.random()*10000000)
        result = tpl1.replace('{{domain}}',domain).replace('{{info}}',result.html()).replace('{{index}}',index).replace('{{indexLink}}',index).replace('{{id}}',index)
        $("#accordionOne").prepend result
#        $(".collapse-panel").each (index) ->
#          $(this).collapse "toggle"

  $("#loader").fadeOut()

  $("#input").val null
  $("#refer").show()
  $(".collapse").collapse()
shuffle = (array) ->
  currentIndex = array.length
  temporaryValue = undefined
  randomIndex = undefined

  # While there remain elements to shuffle...
  while 0 isnt currentIndex

    # Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    # And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  array

jQuery ($) ->
  $ ->
    topDomains = shuffle(window.topDomains)
    i = 0
    while i < topDomains.length
      $("#accordionTwo").prepend "<div class='panel panel-default whoisPanel active'><div class='panel-heading'><h4 class='panel-title'><a target='_blank' href='http://" + topDomains[i].url + "'>"+topDomains[i].url.toUpperCase()+"</a> <span class='info'><a target='_blank' href='mailto:" + topDomains[i].email + "?subject=Buy+domain+with+(AMWEBWhoIs)&body=Hi,+i+am+requsting+price+for:+"+topDomains[i].url.toUpperCase()+"'>Request Price</a></span></h4></div></div>"
      i++
  $("#get").click (e) ->
    e.preventDefault()
    $.getWhoIs()

  $("#whoForm").submit (e) ->
    e.preventDefault()
    $.getWhoIs()

  $('#myTab a').click  (e) ->
    e.preventDefault()
    $(this).tab('show')
