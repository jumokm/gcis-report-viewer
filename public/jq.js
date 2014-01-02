
// settings
var report = 'nca3';
var server = 'http://data-stage.globalchange.gov';

// globals
var current_chapter;
var current_category;
var current_finding;
var current_figure;

// jq.js
$(main);

function load_all_buttons(url, div, label, template) {
    $.getJSON(url,
        function(data) {
            var t = $('<div id="' + div + '"><h3>' + label + '</h3>');
            var html = $("#" + template).html();
            $(data).each(function() { t.append(_.template(html, this)); });
            t.append('</div>');
            $('#main').append(t);
        });
}

function load_chapters(report) {
    load_all_buttons(server + '/report/' + report + '/chapter.json?all=1', 'chapter', 'Chapters', 'chapter_button' );
}

function load_findings(e) {
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'findings';
    $('#category_findings').addClass('active');
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    $('#findings').remove();
    $('#figures').remove();
    load_all_buttons(server + '/report/' + report + '/chapter/' + current_chapter + '/finding.json?all=1', 'findings', 'Findings', 'finding_button' );
}

function load_figures(e) {
    console.log('load figures');
    if (current_category) {
        $('#category_' + current_category).removeClass('active');
    }
    current_category = 'figures';
    $('#category_figures').addClass('active');
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    $('#figures').remove();
    $('#findings').remove();
    load_all_buttons(server + '/report/' + report + '/chapter/' + current_chapter + '/figure.json?all=1', 'figures', 'Figures', 'figure_button' );
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
    $('#figures').remove();
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    if (current_chapter) {
        $.getJSON( server + '/report/' + report + '/chapter/' + current_chapter + '.json' , function(d) {
            $('#main').append(_.template($('#chapter_contents').html(), d ));
        } );
    }
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
    $('#shown_figure').remove();
    console.log('choose finding ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/finding/' + identifier + '.json',
            function(d) {
                $('#main').append(_.template($('#show_finding').html(),d));
            });
}

function choose_figure (e) {
    var t = $(e.target);
    var identifier = t.attr('figure_identifier');
    if (current_figure) {
        $('#figure_' + current_figure).removeClass('active');
    }
    current_figure = identifier;
    $('#figure_' + identifier).addClass('active');
    $('#shown_finding').remove();
    $('#shown_figure').remove();
    console.log('choose figure ' + identifier);
    $.getJSON(server + '/report/' + report + '/chapter/' + current_chapter + '/figure/' + identifier + '.json',
            function(d) {
                console.log('got ', d);
                $('#main').append(_.template($('#show_figure').html(),d));
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
    $(document).delegate(".figures","click",load_figures);
    $(document).delegate(".finding_link","click",choose_finding);
    $(document).delegate(".figure_link","click",choose_figure);
}


