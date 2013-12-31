
// settings
var report = 'nca3';
var server = 'http://data-stage.globalchange.gov';

// globals
var current_chapter;

// jq.js
$(main);

function load_chapters(report) {
    $('#report').text(report);
    $.getJSON(server + '/report/' + report + '/chapter.json?all=1',
        function(data) {
            console.log(data);
            var t = $('<table id="chapter">');
            $(data).each(function() {
                t.append(_.template($("#chapter_row").html(), this));
            });
            t.append('</table>');
            $('#main').html(t);
            
        }
    );
}

function choose_chapter(e) {
    var t = $(e.target);
    current_chapter = t.attr('chapter_identifier');
    if (current_chapter) {
        $('.breadcrumb').append('<li class="chapter_link"><a>' + current_chapter + '</a></li>' );
    } else {
        current_chapter = t.text();
        t.parent().nextAll().remove();
    }
    $('#main').html($('#chapter_contents').html());
}

function load_findings(e) {
    var url = server + '/report/' + report + '/chapter/' + current_chapter + '/finding.json';
    $.getJSON(url, function(data) {
        console.log('got', data);
    });
    $('.breadcrumb').append('<li>finding</li>' );
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/finding.json?all=1',
            function(data) {
                var t = $('<table id="finding">');
                $(data).each(function() {
                    t.append(_.template($("#finding_row").html(), this));
                });
                t.append('</table>');
                $('#main').html(t);
            });
}

function main() {
    load_chapters(report);
    $('#load_chapters').click(function() {
        $(this).nextAll().remove();
        load_chapters(report) }
        );
    $(document).delegate(".chapter_link","click",choose_chapter);
    $(document).delegate(".findings","click",load_findings);
}
