//@ sourceMappingURL=main.map
// Generated by CoffeeScript 1.6.1
(function() {
  var shuffle, tpl1;

  tpl1 = '<div class="panel panel-default whoisPanel active">\
                    <div class="panel-heading">\
                        <h4 class="panel-title">\
                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapse{{index}}"  id="collapseLink{{indexLink}}">\
                                {{domain}}\
\
                            </a>\
                        </h4>\
                    </div>\
                    <div id="collapse{{id}}" class="panel-collapse collapse">\
                        <div class="panel-body">\
                            {{info}}\
                        </div>\
                    </div>\
        </div>';

  shuffle = function(array) {
    var currentIndex, randomIndex, temporaryValue;
    currentIndex = array.length;
    temporaryValue = void 0;
    randomIndex = void 0;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  $.getWhoIs = function() {
    var domain, serviceUrl;
    $("#whoClick").click();
    domain = $("#input").val().replace(".am", "") + ".am";
    serviceUrl = "https://www.amnic.net/whois/?domain=" + domain;
    $("#loader").fadeIn();
    $("#alert").hide(0);
    $("#tabWrapper").css('margin-top', '120px');
    $.ajax({
      type: "GET",
      url: serviceUrl,
      crossDomain: true,
      cache: false,
      async: false,
      success: function(data) {
        var html, index, result;
        html = $(data);
        result = html.filter("ul");
        if (result.length < 1) {
          $("#alert").show(0);
          return $("#tabWrapper").css('margin-top', '160px');
        } else {
          index = Math.floor(Math.random() * 10000000);
          result = tpl1.replace('{{domain}}', domain).replace('{{info}}', result.html()).replace('{{index}}', index).replace('{{indexLink}}', index).replace('{{id}}', index);
          $("#accordionOne").prepend(result);
          return chrome.storage.local.get(null, function(res) {
            if (!res.domainList) {
              res = {
                domainList: []
              };
            }
            res.domainList.push({
              key: domain,
              html: result
            });
            return chrome.storage.local.set(res);
          });
        }
      }
    });
    $("#loader").fadeOut();
    $("#input").val(null);
    $("#refer").show();
    return $(".collapse").collapse();
  };

  jQuery(function($) {
    $(function() {
      var i, topDomains, _results;
      topDomains = shuffle(window.topDomains);
      i = 0;
      _results = [];
      while (i < topDomains.length) {
        $("#accordionTwo").prepend("<div class='panel panel-default whoisPanel active'><div class='panel-heading'><h4 class='panel-title'><a target='_blank' href='http://" + topDomains[i].url + "'>" + topDomains[i].url.toUpperCase() + "</a> <span class='info'><a target='_blank' href='mailto:" + topDomains[i].email + "?subject=Buy+domain+with+(AMWEBWhoIs)&body=Hi,+I+am+requesting+the+price+for:+" + topDomains[i].url.toUpperCase() + "'>Request Price</a></span></h4></div></div>");
        _results.push(i++);
      }
      return _results;
    });
    chrome.storage.local.get(null, function(result) {
      var i, _results;
      if (result.domainList) {
        i = 0;
        _results = [];
        while (i < result.domainList.length) {
          _results.push($("#accordionOne").append(result.domainList[i].html));
        }
        return _results;
      }
    });
    $("#get").click(function(e) {
      e.preventDefault();
      return $.getWhoIs();
    });
    $("#whoForm").submit(function(e) {
      e.preventDefault();
      return $.getWhoIs();
    });
    return $('#myTab a').click(function(e) {
      e.preventDefault();
      return $(this).tab('show');
    });
  });

}).call(this);
