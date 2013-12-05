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

$.getWhoIs = ->
  $("#whoClick").click()
  domain = $("#input").val().replace(".am","") + ".am"
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
        chrome.storage.local.get null, (res) ->
          if !res.domainList
            res = { domainList : [] }
          res.domainList.push({
            key: domain,
            html: result
          })
          chrome.storage.local.set res;


  $("#loader").fadeOut()
  $("#input").val null
  $("#refer").show()
  $(".collapse").collapse()


jQuery ($) ->
  $ ->
    topDomains = shuffle(window.topDomains)
    i = 0
    while i < topDomains.length
      $("#accordionTwo").prepend "<div class='panel panel-default whoisPanel active'><div class='panel-heading'><h4 class='panel-title'><a target='_blank' href='http://" + topDomains[i].url + "'>"+topDomains[i].url.toUpperCase()+"</a> <span class='info'><a target='_blank' href='mailto:" + topDomains[i].email + "?subject=Buy+domain+with+(AMWEBWhoIs)&body=Hi,+I+am+requesting+the+price+for:+"+topDomains[i].url.toUpperCase()+"'>Request Price</a></span></h4></div></div>"
      i++

  chrome.storage.local.get  null, (result) ->
    if result.domainList
      i = 0;
      while i < result.domainList.length
        $("#accordionOne").append result.domainList[i].html
  $("#get").click (e) ->
    e.preventDefault()
    $.getWhoIs()

  $("#whoForm").submit (e) ->
    e.preventDefault()
    $.getWhoIs()

  $('#myTab a').click  (e) ->
    e.preventDefault()
    $(this).tab('show')
