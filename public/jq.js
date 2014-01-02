
// settings
var report = 'nca3';
var server = 'http://data-stage.globalchange.gov';

// globals
var current_chapter;
var current_category;
var current_finding;

// jq.js
$(main);

function load_chapters(report) {
    $.getJSON(server + '/report/' + report + '/chapter.json?all=1',
        function(data) {
            var t = $('<div id="chapter"><h3>Chapters</h3>');
            $(data).each(function() {
                var html = $("#chapter_button").html();
                t.append(_.template($("#chapter_button").html(), this));
            });
            t.append('</div>');
            $('#main').append(t);
            
        }
    );
}

function choose_chapter(e) {
    var t = $(e.target);
    if (current_chapter) {
        $('#chapter_' + current_chapter).removeClass('active');
    }
    current_chapter = t.attr('chapter_identifier');
    t.addClass('active');
    $('#chapter_contents_list').remove();
    $('#findings').remove();
    $('#shown_finding').remove();
    if (current_chapter) {
        $.getJSON( server + '/report/' + report + '/chapter/' + current_chapter + '.json' , function(d) {
            $('#main').append(_.template($('#chapter_contents').html(), d ));
        } );
    }
}

function load_findings(e) {
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'findings';
    $('#category_findings').addClass('active');
    $('#findings').remove();
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/finding.json?all=1',
            function(data) {
                var t = $('<div id="findings"><h3>Findings</h3>');
                $(data).each(function() {
                    t.append(_.template($("#finding_button").html(), this));
                });
                t.append('</div>');
                $('#main').append(t);
            });
}

function choose_finding (e) {
    var t = $(e.target);
    var identifier = t.attr('finding_identifier');
    if (current_finding) {
        $('#finding_' + current_finding).removeClass('active');
    }
    current_finding = identifier;
    $('#finding_' + identifier).addClass('active');
    $('#shown_finding').remove();
    console.log('choose finding ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/finding/' + identifier + '.json',
            function(d) {
                $('#main').append(_.template($('#show_finding').html(),d));
            });
}

function set_title(r) {
    $('#title').html(r);
}

function main() {
    $.getJSON( server + '/report/' + report + '.json', function(d) {
        $('#report_' + report).addClass('active');
        set_title(d.title);
        load_chapters(report);
    });
    $(document).delegate(".chapter_link","click",choose_chapter);
    $(document).delegate(".findings","click",load_findings);
    $(document).delegate(".finding_link","click",choose_finding);
}



