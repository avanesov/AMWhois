var Who = {}
Who.serviceUrl = "https://www.amnic.net/whois/?domain="

Who.resultRow = '<div class="panel panel-default whoisPanel active">\
                    <div class="panel-heading"><h4 class="panel-title">\
                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}"  id="collapseLink{{indexLink}}">\
                                {{domain}}\
                            </a>\
                            <span class="info removeResult"><a data-domain="{{domainkey}}" href="#">Remove</a></span>\
                        </h4>\
                    </div>\
                    <div id="collapse{{id}}" class="panel-collapse collapse">\
                        <div class="panel-body">{{info}}</div>\
                    </div>\
                  </div>'

Who.topDomainRow = '<div class="panel panel-default whoisPanel active">\
                        <div class="panel-heading">\
                            <h4 class="panel-title">\
                                <a target="_blank" href="http://{{url}}">{{humanUrl}}</a>\
                                <span class="info"><a target="_blank" href="mailto:{{email}}?subject=Buy+domain+with+(AMWEBWhoIs)&body=Hi,+I+am+requesting+the+price+for:{{emailUrl}}">Request Price</a></span>\
                            </h4>\
                        </div>\
                    </div>'

Who.shuffle = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

Who.getDomain = function () {
    return $("#input").val().replace(".am", "") + ".am"
}


Who.renderResult = function (domain,result, index) {
    return Who.resultRow
        .replace('{{domain}}', domain)
        .replace('{{domainkey}}', domain)
        .replace('{{info}}', result.html())
        .replace('{{index}}', index)
        .replace('{{indexLink}}', index)
        .replace('{{id}}', index)
}

Who.insertResult = function(html){
    $("#accordionOne").prepend(html)
    Who.setDeleteHandler();
}

Who.saveResult = function(domain,result){

    chrome.storage.local.get('results', function(data){

        if(typeof data.results == "undefined"){
            var persistData = []
        } else {
            var persistData = data.results
        }

        persistData.push({
            'id' : domain,
            'html' : escape(result)
        })

        chrome.storage.local.set({
            'results' : persistData
        },function(){

        })

    })

}


Who.setDeleteHandler = function () {
    $(".removeResult a").click(function(e){
        e.preventDefault()
        var domain = $(this).data('domain')
        Who.removeResult(domain)
        $(this).closest('div.panel').remove()
    })
}

Who.removeResult = function(domain){

    chrome.storage.local.get('results', function(data){
        if(typeof data.results != "undefined"){
            var results = data.results
            for(var i = 0; i < results.length;i++){
                if(results[i].id === domain){
                    delete results[i]
                }
            }

            chrome.storage.local.set({
                'results' : results
            },function(){

            })
        }
    })
}

Who.reloadResults = function(){

    chrome.storage.local.get('results', function(data){
        if(typeof data.results != "undefined"){
               for(var i = 0; i <data.results.length;i++){
                   Who.insertResult(unescape(data.results[i].html))
               }
        }
    })

}

Who.collapseResults = function(){
    $(".collapse").collapse()
}

Who.renderTopDomains = function(){

    topDomains = Who.shuffle(topDomains)
    for (var i = 0; i < topDomains.length; i++) {
        var html = Who.topDomainRow
            .replace('{{url}}',topDomains[i].url)
            .replace('{{humanUrl}}',topDomains[i].url.toUpperCase())
            .replace('{{email}}',topDomains[i].email)
            .replace('{{emailUrl}}',topDomains[i].url.toUpperCase())
        $("#accordionTwo").prepend(html)
    }
}

Who.setHandlers = function(){
    $("#get").click(function (e) {
        e.preventDefault()
        Who.getWhoIs()
    })
    $("#whoForm").submit(function (e) {
        e.preventDefault()
        Who.getWhoIs()
    })

    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
}

Who.generateIndex = function(){
    return Math.floor(Math.random() * 10000000)
}

Who.showAlert = function(){
    $("#alert").show(0)
    $("#tabWrapper").css('margin-top', '160px')
}

Who.hideAlert = function(){
    $("#alert").hide(0)
    $("#tabWrapper").css('margin-top', '120px')
}

Who.showLoader = function(){
    $("#loader").fadeIn()
}

Who.hideLoader = function(){
    $("#loader").fadeOut()
}

Who.clearInput = function(){
    $("#input").val(null)
}

Who.getWhoIs = function () {
    Who.showLoader()
    Who.hideAlert()
    $.ajax({
        type: "GET",
        url: Who.serviceUrl + Who.getDomain(),
        crossDomain: true,
        cache: false,
        async: false,
        success: function (data) {
            var result = $(data).filter("ul")
            if (result.length < 1) {
               Who.showAlert()
            } else {
                var html = Who.renderResult(Who.getDomain(),result, Who.generateIndex())
                Who.insertResult(html)
                Who.saveResult(Who.getDomain(),html)
                Who.collapseResults()
                Who.clearInput()
            }
        }
    })
    Who.hideLoader()
}

jQuery(function ($) {
    Who.renderTopDomains()
    Who.reloadResults()
    Who.setHandlers()
})