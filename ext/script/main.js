var Who = {}
Who.serviceUrl = "https://www.amnic.net/whois/?domain="

Who.resultRow = '<div class="panel panel-default whoisPanel active">\
                    <div class="panel-heading"><h4 class="panel-title">\
                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}"  id="collapseLink{{indexLink}}">\
                                {{domain}}\
                            </a>\
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
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

Who.getDomain = function () {
    return $("#input").val().replace(".am", "") + ".am"
}


Who.renderResult = function (domain,result, index) {
    return Who.resultRow
        .replace('{{domain}}', domain)
        .replace('{{info}}', result.html())
        .replace('{{index}}', index)
        .replace('{{indexLink}}', index)
        .replace('{{id}}', index)
}

Who.insertResult = function(html){
    $("#accordionOne").prepend(html)
}

Who.collapseResults = function(){
    $(".collapse").collapse()
}

Who.renderTop = function(){

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

Who.showRefer = function(){
    $("#refer").show()
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
                Who.insertResult(Who.renderResult(Who.getDomain(),result, Who.generateIndex()))
                Who.showRefer()
                Who.collapseResults()
                Who.clearInput()
            }
        }
    })
    Who.hideLoader()
}

jQuery(function ($) {
    Who.renderTop()
    Who.setHandlers()
})